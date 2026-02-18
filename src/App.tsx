import { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Container, Nav, Navbar, Row, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import type ConvertOption from './ConvertOption';
import { getConvertOptionDefault } from './ConvertOption';
import type LuaCodeOption from './LuaCodeOption';
import { getLuaCodeOptionDefault } from './LuaCodeOption';
import Color from './Color';
import { fileToU8Image } from './PictureFileReader';
import FinalLuaCode from './gencode/FinalLuaCode';
import FinalizeLuaCode from './gencode/FinalizeLuaCode';
import ConvertCardCommand from './worker/ConvertCardCommand';
import ConvertResultCommand from './worker/ConvertResultCommand';
import ConvertSucceedCommand from './worker/ConvertSucceedCommand';
import EndConvertCommand from './worker/EndConvertCommand';
import FileLoadedCommand from './worker/FileLoadedCommand';
import OpenFileCommand from './worker/OpenFileCommand';
import StartConvertCommand from './worker/StartConvertCommand';
import TerminateConverterCommand from './worker/TerminateConverterCommand';
import type WorkerCommand from './worker/WorkerCommand';
import AboutModal from './ui/AboutModal';
import ConvertBox from './ui/ConvertBox';
import FileSelector from './ui/FileSelector';
import HelpModal from './ui/HelpModal';
import LandingBox from './ui/LandingBox';
import LuaCode from './ui/LuaCode';
import Settings from './ui/Settings';
import './App.scss';

type ModalView = '' | 'help' | 'about';

export default function App() {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState('');
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  const [colorSet, setColorSet] = useState<Color[]>([]);
  const [orderTable, setOrderTable] = useState<number[]>([]);
  const [transparentStartOrder, setTransparentStartOrder] = useState(0);

  const [convertProgress, setConvertProgress] = useState(0);
  const [isWorking, setIsWorking] = useState(false);

  const [needReconvert, setNeedReconvert] = useState(false);
  const [luaCodes, setLuaCodes] = useState<string[][]>();
  const [generatedCode, setGeneratedCode] = useState(() => new FinalLuaCode([]));

  const [convertOption, setConvertOption] = useState<ConvertOption>(() => getConvertOptionDefault());
  const [luaCodeOption, setLuaCodeOption] = useState<LuaCodeOption>(() => getLuaCodeOptionDefault());
  const [modalShow, setModalShow] = useState<ModalView>('');

  const workerRef = useRef<Worker>();
  const subWorkerRef = useRef<Worker>();
  const handleWorkerMessageRef = useRef<(evt: MessageEvent<WorkerCommand>) => void>(() => {});

  const imageUrlRef = useRef(imageUrl);
  const colorSetRef = useRef(colorSet);
  const orderTableRef = useRef(orderTable);
  const luaCodesRef = useRef(luaCodes);
  const convertOptionRef = useRef(convertOption);
  const luaCodeOptionRef = useRef(luaCodeOption);

  useEffect(() => {
    imageUrlRef.current = imageUrl;
  }, [imageUrl]);
  useEffect(() => {
    colorSetRef.current = colorSet;
  }, [colorSet]);
  useEffect(() => {
    orderTableRef.current = orderTable;
  }, [orderTable]);
  useEffect(() => {
    luaCodesRef.current = luaCodes;
  }, [luaCodes]);
  useEffect(() => {
    convertOptionRef.current = convertOption;
  }, [convertOption]);
  useEffect(() => {
    luaCodeOptionRef.current = luaCodeOption;
  }, [luaCodeOption]);

  const restartWorker = useCallback(() => {
    workerRef.current?.terminate();
    const nextWorker = new Worker(new URL('./worker/Worker.ts', import.meta.url));
    nextWorker.onmessage = (evt) => handleWorkerMessageRef.current(evt as MessageEvent<WorkerCommand>);
    workerRef.current = nextWorker;
    return nextWorker;
  }, []);

  const getWorker = useCallback(() => {
    return workerRef.current ?? restartWorker();
  }, [restartWorker]);

  const handleApplySettingsClick = useCallback(() => {
    const currentOrderTable = orderTableRef.current;
    const currentColorSet = colorSetRef.current;
    const orderedColors = new Array<Color>(currentOrderTable.length);
    for (let i = 0; i < currentOrderTable.length; i++) {
      orderedColors[currentOrderTable[i]] = currentColorSet[i];
    }
    const final = FinalizeLuaCode(
      luaCodesRef.current ?? [],
      orderedColors,
      convertOptionRef.current,
      luaCodeOptionRef.current,
    );
    setGeneratedCode(final);
  }, []);

  const handleWorkerMessage = useCallback(
    (evt: MessageEvent<WorkerCommand>) => {
      const data = evt.data;
      if (ConvertCardCommand.is(data)) {
        let subWorker = subWorkerRef.current;
        if (!subWorker) {
          subWorker = new Worker(new URL('./gencode/GenCode.ts', import.meta.url));
          subWorker.onmessage = (subEvt) => handleWorkerMessageRef.current(subEvt as MessageEvent<WorkerCommand>);
          subWorkerRef.current = subWorker;
        }
        const nextData = ConvertCardCommand.from(data);
        subWorker.postMessage(nextData, nextData.getTransfer());
      } else if (TerminateConverterCommand.is(data)) {
        subWorkerRef.current?.terminate();
        subWorkerRef.current = undefined;
      } else if (ConvertSucceedCommand.is(data)) {
        const nextData = ConvertSucceedCommand.from(data);
        getWorker().postMessage(nextData, nextData.getTransfer());
      } else if (FileLoadedCommand.is(data)) {
        const nextColorSet = data.colorPallete.map(
          (v) => new Color(v.originalR, v.originalG, v.originalB, v.originalA, v.raw),
        );
        const nextOrderTable = nextColorSet.map((_, i) => i);
        setColorSet(nextColorSet);
        setOrderTable(nextOrderTable);
        setImageLoading(false);
        setTransparentStartOrder(nextOrderTable.length);
        setNeedReconvert(true);
      } else if (ConvertResultCommand.is(data)) {
        setLuaCodes((prev) => {
          const next = [...(prev ?? [])];
          next[data.metaData.offsetListIndex] = data.luaList;
          luaCodesRef.current = next;
          return next;
        });
        setConvertProgress(data.metaData.finished / data.metaData.length);
      } else if (EndConvertCommand.is(data)) {
        setIsWorking(false);
        setConvertProgress(1);
        setNeedReconvert(false);
        handleApplySettingsClick();
      }
    },
    [getWorker, handleApplySettingsClick],
  );

  useEffect(() => {
    handleWorkerMessageRef.current = handleWorkerMessage;
  }, [handleWorkerMessage]);

  const handleBeforeUnloadEvent = useCallback((evt: BeforeUnloadEvent) => {
    if (imageUrlRef.current !== undefined) {
      evt.preventDefault();
    }
    evt.returnValue = '';
    workerRef.current?.terminate();
    subWorkerRef.current?.terminate();
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnloadEvent);
    restartWorker();
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloadEvent);
      workerRef.current?.terminate();
      subWorkerRef.current?.terminate();
      workerRef.current = undefined;
      subWorkerRef.current = undefined;
    };
  }, [handleBeforeUnloadEvent, restartWorker]);

  const handleFileChange = useCallback(
    (file: File) => {
      setImageLoading(true);
      fileToU8Image(file, true).then((res) => {
        setImageUrl(res.dataUrl);
        setImageWidth(res.width);
        setImageHeight(res.height);
        const cmd = new OpenFileCommand(res.u8Image, res.width, res.height, true);
        getWorker().postMessage(cmd, cmd.getTransfer());
      });
    },
    [getWorker],
  );

  const handleOnDrawChange = useCallback((colorIndex: number, drawFlag: boolean) => {
    setOrderTable((prevOrderTable) => {
      let nextOrderTable = prevOrderTable.slice();
      const order = nextOrderTable[colorIndex];
      let nextTransparentStartOrder = transparentStartOrder;

      if (order < nextTransparentStartOrder && drawFlag) {
        nextOrderTable = nextOrderTable.map((v) =>
          v > order && v < nextTransparentStartOrder ? v - 1 : v,
        );
        nextOrderTable[colorIndex] = --nextTransparentStartOrder;
      } else if (order >= nextTransparentStartOrder && !drawFlag) {
        nextOrderTable = nextOrderTable.map((v) =>
          v >= nextTransparentStartOrder && v < order ? v + 1 : v,
        );
        nextOrderTable[colorIndex] = nextTransparentStartOrder++;
      }

      setTransparentStartOrder(nextTransparentStartOrder);
      setNeedReconvert(true);
      return nextOrderTable;
    });
  }, [transparentStartOrder]);

  const handleOnMoveUpClick = useCallback((colorIndex: number) => {
    setOrderTable((prevOrderTable) => {
      const nextOrderTable = prevOrderTable.slice();
      const order = nextOrderTable[colorIndex];
      nextOrderTable[nextOrderTable.indexOf(order - 1)] = order;
      nextOrderTable[colorIndex] = order - 1;
      return nextOrderTable;
    });
    setNeedReconvert(true);
  }, []);

  const handleOnMoveDownClick = useCallback((colorIndex: number) => {
    setOrderTable((prevOrderTable) => {
      const nextOrderTable = prevOrderTable.slice();
      const order = nextOrderTable[colorIndex];
      nextOrderTable[nextOrderTable.indexOf(order + 1)] = order;
      nextOrderTable[colorIndex] = order + 1;
      return nextOrderTable;
    });
    setNeedReconvert(true);
  }, []);

  const handleOnColorChange = useCallback((colorIndex: number, colorInput: string) => {
    setColorSet((prevColorSet) => {
      const nextColorSet = prevColorSet.slice();
      nextColorSet[colorIndex].setConvertedRGB(colorInput);
      return nextColorSet;
    });
  }, []);

  const handleStartConvertClick = useCallback(() => {
    if (!needReconvert) {
      return;
    }
    const u = new Uint32Array(orderTable.length);
    for (let i = 0; i < orderTable.length; i++) {
      u[orderTable[i]] = colorSet[i].raw || 0;
    }
    const cmd = new StartConvertCommand(convertOption, u, transparentStartOrder);
    getWorker().postMessage(cmd, cmd.getTransfer());
    setIsWorking(true);
    setLuaCodes([]);
  }, [colorSet, convertOption, getWorker, needReconvert, orderTable, transparentStartOrder]);

  const handleStopConvertClick = useCallback(() => {
    const cmd = new TerminateConverterCommand();
    getWorker().postMessage(cmd, cmd.getTransfer());
    setIsWorking(false);
  }, [getWorker]);

  const handleModalClose = useCallback(() => {
    setModalShow('');
  }, []);

  const handleChangeConvertSettings = useCallback(
    (opt: Partial<ConvertOption>, needReconvertFlag: boolean = false) => {
      setConvertOption((prev) => ({ ...prev, ...opt }));
      setNeedReconvert((prev) => needReconvertFlag || prev);
    },
    [],
  );

  const handleChangeLuaCodeSettings = useCallback((opt: Partial<LuaCodeOption>) => {
    setLuaCodeOption((prev) => ({ ...prev, ...opt }));
  }, []);

  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="light">
        <Container className="px-5" fluid="xl">
          <Navbar.Brand>Storm Kamishibai</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="https://forms.gle/TRxMsVQLBrCc3yJF7" target="_blank">{t('app.contact')}</Nav.Link>
              <Nav.Link onClick={() => setModalShow('help')}>{t('app.help')}</Nav.Link>
              <Nav.Link onClick={() => setModalShow('about')}>{t('app.about')}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="px-5 mb-4" fluid="xl">
        <Row>
          <Col md={4} lg={6} className="mt-4">
            <Stack gap={2}>
              <FileSelector
                onFileChange={handleFileChange}
                imageUrl={imageUrl}
                width={imageWidth}
                height={imageHeight}
                loading={imageLoading}
              />
              <ConvertBox
                isVisible={imageUrl !== ''}
                isWorking={isWorking}
                onStartConvertClick={handleStartConvertClick}
                onStopConvertClick={handleStopConvertClick}
                onApplyClick={handleApplySettingsClick}
                needReconvert={needReconvert}
                convertProgress={convertProgress}
              />
              <LuaCode isVisible={imageUrl !== ''} code={generatedCode} />
            </Stack>
          </Col>
          <Col md={8} lg={6} className="mt-4">
            <LandingBox isVisible={imageUrl === ''} />
            <Settings
              isVisible={imageUrl !== ''}
              main={{
                changeConvertSettings: handleChangeConvertSettings,
                changeLuaCodeSettings: handleChangeLuaCodeSettings,
                luaCodeOption: luaCodeOption,
                convertOption: convertOption,
                colorSet: colorSet,
                colorOrder: orderTable,
                transparentStartOrder: transparentStartOrder,
                onDrawFlagChange: handleOnDrawChange,
                onMoveUpClick: handleOnMoveUpClick,
                onMoveDownClick: handleOnMoveDownClick,
                onColorChange: handleOnColorChange,
              }}
            />
          </Col>
        </Row>
      </Container>
      <HelpModal show={modalShow === 'help'} onClose={handleModalClose} />
      <AboutModal show={modalShow === 'about'} onClose={handleModalClose} />
    </>
  );
}


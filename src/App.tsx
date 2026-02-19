import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Navbar, Row, Col, Stack, Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FileSelector from "./ui/FileSelector";
import LuaCode from "./ui/LuaCode";
import ConvertBox from "./ui/ConvertBox";

import type LuaCodeOption from "./LuaCodeOption";
import { getLuaCodeOptionDefault } from "./LuaCodeOption";
import "./App.scss";
import Settings from "./ui/Settings";
import type ConvertOption from "./ConvertOption";
import { getConvertOptionDefault } from "./ConvertOption";
import FinalizeLuaCode from "./gencode/FinalizeLuaCode";
import HelpModal from "./ui/HelpModal";
import AboutModal from "./ui/AboutModal";
import LandingBox from "./ui/LandingBox";
import FinalLuaCode from "./gencode/FinalLuaCode";
import ConvertCardCommand from "./worker/ConvertCardCommand";
import ConvertSucceedCommand from "./worker/ConvertSucceedCommand";
import TerminateConverterCommand from "./worker/TerminateConverterCommand";
import StartConvertCommand from "./worker/StartConvertCommand";
import OpenFileCommand from "./worker/OpenFileCommand";
import { fileToU8Image } from "./PictureFileReader";
import Color from "./Color";
import FileLoadedCommand from "./worker/FileLoadedCommand";
import WorkerCommand from "./worker/WorkerCommand";
import ConvertResultCommand from "./worker/ConvertResultCommand";
import EndConvertCommand from "./worker/EndConvertCommand";
import MainWorker from "./worker/Worker.ts?worker";
import GenCodeWorker from "./gencode/GenCode.ts?worker";

type ModalShow = "" | "help" | "about";

const App: React.FC = () => {
  const { t } = useTranslation();

  const [imageUrl, setImageUrl] = useState("");
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  const [colorSet, _setColorSet] = useState<Color[]>([]);
  const colorSetRef = useRef<Color[]>([]);
  const setColorSet = (v: Color[] | ((prev: Color[]) => Color[])) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next = typeof v === "function" ? (v as any)(colorSetRef.current) : v;
    colorSetRef.current = next;
    _setColorSet(next);
  };

  const [orderTable, _setOrderTable] = useState<number[]>([]);
  const orderTableRef = useRef<number[]>([]);
  const setOrderTable = (v: number[] | ((prev: number[]) => number[])) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next =
      typeof v === "function" ? (v as any)(orderTableRef.current) : v;
    orderTableRef.current = next;
    _setOrderTable(next);
  };

  const [transparentStartOrder, _setTransparentStartOrder] =
    useState<number>(0);
  const transparentStartOrderRef = useRef<number>(0);
  const setTransparentStartOrder = (v: number | ((prev: number) => number)) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next =
      typeof v === "function"
        ? (v as any)(transparentStartOrderRef.current)
        : v;
    transparentStartOrderRef.current = next as number;
    _setTransparentStartOrder(next as number);
  };

  const [convertProgress, setConvertProgress] = useState(0);
  const workerRef = useRef<Worker | undefined>(undefined);
  const subWorkerRef = useRef<Worker | undefined>(undefined);
  const [isWorking, setIsWorking] = useState(false);

  const [needReconvert, _setNeedReconvert] = useState(false);
  const needReconvertRef = useRef(false);
  const setNeedReconvert = (v: boolean | ((prev: boolean) => boolean)) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next =
      typeof v === "function" ? (v as any)(needReconvertRef.current) : v;
    needReconvertRef.current = next as boolean;
    _setNeedReconvert(next as boolean);
  };

  const [luaCodes, _setLuaCodes] = useState<string[][] | undefined>(undefined);
  const luaCodesRef = useRef<string[][] | undefined>(undefined);
  const setLuaCodes = (
    v: string[][] | undefined | ((prev?: string[][]) => string[][] | undefined),
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next = typeof v === "function" ? (v as any)(luaCodesRef.current) : v;
    luaCodesRef.current = next as string[][] | undefined;
    _setLuaCodes(next as string[][] | undefined);
  };

  const [generatedCode, setGeneratedCode] = useState<FinalLuaCode>(
    new FinalLuaCode([]),
  );

  const [convertOption, _setConvertOption] = useState<ConvertOption>(
    getConvertOptionDefault(),
  );
  const convertOptionRef = useRef<ConvertOption>(convertOption);
  const setConvertOption = (
    v: ConvertOption | ((prev: ConvertOption) => ConvertOption),
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next =
      typeof v === "function" ? (v as any)(convertOptionRef.current) : v;
    convertOptionRef.current = next as ConvertOption;
    _setConvertOption(next as ConvertOption);
  };

  const [luaCodeOption, _setLuaCodeOption] = useState<LuaCodeOption>(
    getLuaCodeOptionDefault(),
  );
  const luaCodeOptionRef = useRef<LuaCodeOption>(luaCodeOption);
  const setLuaCodeOption = (
    v: LuaCodeOption | ((prev: LuaCodeOption) => LuaCodeOption),
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next =
      typeof v === "function" ? (v as any)(luaCodeOptionRef.current) : v;
    luaCodeOptionRef.current = next as LuaCodeOption;
    _setLuaCodeOption(next as LuaCodeOption);
  };

  const [modalShow, setModalShow] = useState<ModalShow>("");

  // helpers to ensure refs match state when state set externally
  useEffect(() => {
    colorSetRef.current = colorSet;
  }, [colorSet]);
  useEffect(() => {
    orderTableRef.current = orderTable;
  }, [orderTable]);
  useEffect(() => {
    transparentStartOrderRef.current = transparentStartOrder;
  }, [transparentStartOrder]);
  useEffect(() => {
    needReconvertRef.current = needReconvert;
  }, [needReconvert]);
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
    try {
      workerRef.current?.terminate();
    } catch {
      /* empty */
    }
    const _worker = new MainWorker();
    _worker.onmessage = handleWorkerMessage;
    workerRef.current = _worker;
    return _worker;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWorker = useCallback(() => {
    return workerRef.current || restartWorker();
  }, [restartWorker]);

  const handleWorkerMessage = useCallback(
    (evt: MessageEvent<WorkerCommand>) => {
      const data = evt.data;
      if (ConvertCardCommand.is(data)) {
        let _subworker = subWorkerRef.current;
        if (!_subworker) {
          _subworker = new GenCodeWorker();
          _subworker.onmessage = handleWorkerMessage;
          subWorkerRef.current = _subworker;
        }
        const ndata = ConvertCardCommand.from(data);
        _subworker.postMessage(ndata, ndata.getTransfer());
      } else if (TerminateConverterCommand.is(data)) {
        subWorkerRef.current?.terminate();
        subWorkerRef.current = undefined;
      } else if (ConvertSucceedCommand.is(data)) {
        const ndata = ConvertSucceedCommand.from(data);
        getWorker().postMessage(ndata, ndata.getTransfer());
      } else if (FileLoadedCommand.is(data)) {
        const colorSetLocal = data.colorPallete.map(
          (v) =>
            new Color(
              v.originalR,
              v.originalG,
              v.originalB,
              v.originalA,
              v.raw,
            ),
        );
        const orderTableLocal = colorSetLocal.map((_, i) => i);

        setColorSet(colorSetLocal);
        setOrderTable(orderTableLocal);
        setImageLoading(false);
        setTransparentStartOrder(orderTableLocal.length);
        setNeedReconvert(true);
      } else if (ConvertResultCommand.is(data)) {
        setLuaCodes((prev) => {
          const l = prev ? prev.slice() : [];
          l[data.metaData.offsetListIndex] = data.luaList;
          return l;
        });
        setConvertProgress(data.metaData.finished / data.metaData.length);
      } else if (EndConvertCommand.is(data)) {
        setIsWorking(false);
        setConvertProgress(1);
        setNeedReconvert(false);
        // apply settings using latest refs
        const final = FinalizeLuaCode(
          luaCodesRef.current || [],
          ((): Color[] => {
            const u = new Array<Color>(orderTableRef.current.length);
            for (let i = 0; i < orderTableRef.current.length; i++) {
              u[orderTableRef.current[i]] = colorSetRef.current[i];
            }
            return u;
          })(),
          convertOptionRef.current,
          luaCodeOptionRef.current,
        );
        setGeneratedCode(final);
      }
    },
    [getWorker],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnloadEvent);
    restartWorker();
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnloadEvent);
      try {
        workerRef.current?.terminate();
      } catch {
        /* empty */
      }
      try {
        subWorkerRef.current?.terminate();
      } catch {
        /* empty */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBeforeUnloadEvent = useCallback(
    (evt: BeforeUnloadEvent) => {
      if (imageUrl !== undefined) {
        evt.preventDefault();
      }
      evt.returnValue = "";
      try {
        workerRef.current?.terminate();
      } catch {
        /* empty */
      }
      try {
        subWorkerRef.current?.terminate();
      } catch {
        /* empty */
      }
    },
    [imageUrl],
  );

  const handleFileChange = useCallback(
    (file: File) => {
      setImageLoading(true);
      fileToU8Image(file, true).then((res) => {
        setImageUrl(res.dataUrl);
        setImageWidth(res.width);
        setImageHeight(res.height);
        const cmd = new OpenFileCommand(
          res.u8Image,
          res.width,
          res.height,
          true,
        );
        getWorker().postMessage(cmd, cmd.getTransfer());
      });
    },
    [getWorker],
  );

  const handleOnDrawChange = useCallback(
    (colorIndex: number, drawFlag: boolean) => {
      setOrderTable((state) => {
        let k = state.slice();
        const o = k[colorIndex];
        let to = transparentStartOrderRef.current;

        if (o < to && drawFlag) {
          k = k.map((v) => (v > o && v < to ? v - 1 : v));
          k[colorIndex] = --to;
        } else if (o >= to && !drawFlag) {
          k = k.map((v) => (v >= to && v < o ? v + 1 : v));
          k[colorIndex] = to++;
        }

        setTransparentStartOrder(to);
        setNeedReconvert(true);
        return k;
      });
    },
    [],
  );

  const handleOnMoveUpClick = useCallback((colorIndex: number) => {
    setOrderTable((state) => {
      const k = state.slice();
      const o = k[colorIndex];

      k[k.indexOf(o - 1)] = o;
      k[colorIndex] = o - 1;

      setNeedReconvert(true);
      return k;
    });
  }, []);

  const handleOnMoveDownClick = useCallback((colorIndex: number) => {
    setOrderTable((state) => {
      const k = state.slice();
      const o = k[colorIndex];

      k[k.indexOf(o + 1)] = o;
      k[colorIndex] = o + 1;

      setNeedReconvert(true);
      return k;
    });
  }, []);

  const handleOnColorChange = useCallback(
    (colorIndex: number, colorInput: string) => {
      setColorSet((state) => {
        const c = state.slice();
        c[colorIndex].setConvertedRGB(colorInput);
        return c;
      });
    },
    [],
  );

  const handleStartConvertClick = useCallback(() => {
    if (needReconvertRef.current) {
      const u = new Uint32Array(orderTableRef.current.length);
      for (let i = 0; i < orderTableRef.current.length; i++) {
        u[orderTableRef.current[i]] = colorSetRef.current[i].raw || 0;
      }

      const cmd = new StartConvertCommand(
        convertOptionRef.current,
        u,
        transparentStartOrderRef.current,
      );
      getWorker().postMessage(cmd, cmd.getTransfer());
      setIsWorking(true);
      setLuaCodes([]);
    }
  }, [getWorker]);

  const handleStopConvertClick = useCallback(() => {
    const cmd = new TerminateConverterCommand();
    getWorker().postMessage(cmd, cmd.getTransfer());
    setIsWorking(false);
  }, [getWorker]);

  const handleApplySettingsClick = useCallback(() => {
    const u = new Array<Color>(orderTableRef.current.length);
    for (let i = 0; i < orderTableRef.current.length; i++) {
      u[orderTableRef.current[i]] = colorSetRef.current[i];
    }
    const final = FinalizeLuaCode(
      luaCodesRef.current || [],
      u,
      convertOptionRef.current,
      luaCodeOptionRef.current,
    );
    setGeneratedCode(final);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalShow("");
  }, []);

  const handleChangeConvertSettings = useCallback(
    (opt: ConvertOption, need: boolean = false) => {
      setConvertOption((state) => {
        const ss: ConvertOption = { ...state };
        for (const key in opt) {
          if (Object.prototype.hasOwnProperty.call(opt, key)) {
            if (Object.prototype.hasOwnProperty.call(ss, key)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (ss as any)[key] = (opt as any)[key];
            } else {
              console.error(`Key ${key} is not found in ConvertOption.`);
            }
          }
        }
        return ss;
      });
      setNeedReconvert((prev) => need || prev);
    },
    [],
  );

  const handleChangeLuaCodeSettings = useCallback((opt: LuaCodeOption) => {
    setLuaCodeOption((state) => {
      const ss: LuaCodeOption = { ...state };
      for (const key in opt) {
        if (Object.prototype.hasOwnProperty.call(opt, key)) {
          if (Object.prototype.hasOwnProperty.call(ss, key)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (ss as any)[key] = (opt as any)[key];
          } else {
            console.log(`Key ${key} is not found in LuaCodeOption.`);
          }
        }
      }
      return ss;
    });
  }, []);

  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="light">
        <Container className="px-5" fluid="xl">
          <Navbar.Brand>Storm Kamishibai</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Link
                href="https://forms.gle/TRxMsVQLBrCc3yJF7"
                target="_blank"
              >
                {t("app.contact")}
              </Nav.Link>
              <Nav.Link onClick={() => setModalShow("help")}>
                {t("app.help")}
              </Nav.Link>
              <Nav.Link onClick={() => setModalShow("about")}>
                {t("app.about")}
              </Nav.Link>
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
                isVisible={imageUrl !== ""}
                isWorking={isWorking}
                onStartConvertClick={handleStartConvertClick}
                onStopConvertClick={handleStopConvertClick}
                onApplyClick={handleApplySettingsClick}
                needReconvert={needReconvert}
                convertProgress={convertProgress}
              />
              <LuaCode isVisible={imageUrl !== ""} code={generatedCode} />
            </Stack>
          </Col>
          <Col md={8} lg={6} className="mt-4">
            <LandingBox isVisible={imageUrl === ""} />
            <Settings
              isVisible={imageUrl !== ""}
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
      <HelpModal show={modalShow === "help"} onClose={handleModalClose} />
      <AboutModal show={modalShow === "about"} onClose={handleModalClose} />
    </>
  );
};

export default App;

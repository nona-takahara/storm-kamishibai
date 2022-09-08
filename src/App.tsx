import React from 'react';
import { Container, Navbar, Row, Col, Stack, Nav } from 'react-bootstrap';

import FileSelector from './ui/FileSelector';
import ColorList from './ui/ColorList';
import LuaCode from './ui/LuaCode';
import ConvertBox from './ui/ConvertBox';

import PictureData from './PictureData';
import LuaCodeSnippet from './LuaCodeSnippet';
import './App.scss';
import Settings from './ui/Settings';
import LuaCodeOption, { getDefault } from './LuaCodeOption';
import FinalizeLuaCode from './gencode/FinalizeLuaCode';
import HelpModal from './ui/HelpModal';
import AboutModal from './ui/AboutModal';
import LandingBox from './ui/LandingBox';
import FinalLuaCode from './gencode/FinalLuaCode';
import ConvertCardCommand from './worker/ConvertCardCommand';
import ConvertSucceedCommand from './worker/ConvertSucceedCommand';
import TerminateConverterCommand from './worker/TerminateConverterCommand';
import StartConvertCommand from './worker/StartConvertCommand';
import OpenFileCommand from './worker/OpenFileCommand';
import { fileToU8Image } from './PictureFileReader';
import Color from './Color';
import FileLoadedCommand from './worker/FileLoadedCommand';
import WorkerCommand from './worker/WorkerCommand';
import ConvertResultCommand from './worker/ConvertResultCommand';
import EndConvertCommand from './worker/EndConvertCommand';

type AppState = {
  imageUrl: string;
  width: number;
  height: number;

  colorSet: Color[];
  orderTable: number[];
  drawFlagTable: boolean[];

  convertProgress: number;
  worker?: Worker;
  subWorker?: Worker;
  isWorking: boolean;

  needReconvert: boolean;
  luaCodes?: LuaCodeSnippet[];
  generatedCode: FinalLuaCode;

  luaCodeOption: LuaCodeOption;

  modalShow: '' | 'help' | 'about';
};

export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleOnDrawChange = this.handleOnDrawChange.bind(this);
    this.handleOnMoveUpClick = this.handleOnMoveUpClick.bind(this);
    this.handleOnMoveDownClick = this.handleOnMoveDownClick.bind(this);
    this.handleOnColorChange = this.handleOnColorChange.bind(this);
    this.handleStartConvertClick = this.handleStartConvertClick.bind(this);
    this.handleStopConvertClick = this.handleStopConvertClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleBeforeUnloadEvent = this.handleBeforeUnloadEvent.bind(this);
    this.handleChangeSettings = this.handleChangeSettings.bind(this);
    this.state = {
      convertProgress: 0, colorSet: [], orderTable: [], drawFlagTable: [], isWorking: false,
      generatedCode: new FinalLuaCode([]), luaCodeOption: getDefault(), modalShow: '',
      imageUrl: '', width: 0, height: 0, needReconvert: false
    };
  }

  // ----- WebWorker
  restartWorker() {
    this.state.worker?.terminate();
    const _worker = new Worker(new URL('./worker/Worker.ts', import.meta.url));
    _worker.onmessage = this.handleWorkerMessage.bind(this);
    this.setState({ worker: _worker });
    return _worker;
  }

  getWorker() {
    return this.state?.worker || this.restartWorker();
  }

  handleWorkerMessage(evt: MessageEvent<WorkerCommand>) {
    const data = evt.data;
    if (ConvertCardCommand.is(data)) {
      let _subworker = this.state.subWorker;
      if (!_subworker) {
        _subworker = new Worker(new URL('./gencode/GenCode.ts', import.meta.url));
        _subworker.onmessage = this.handleWorkerMessage.bind(this);
        this.setState({ subWorker: _subworker });
      }
      const ndata = ConvertCardCommand.from(data);
      _subworker.postMessage(ndata, ndata.getTransfer());

    } else if (TerminateConverterCommand.is(data)) {
      this.state.subWorker?.terminate();
      this.setState({ subWorker: undefined });

    } else if (ConvertSucceedCommand.is(data)) {
      const ndata = ConvertSucceedCommand.from(data);
      this.getWorker().postMessage(ndata, ndata.getTransfer());

    } else if (FileLoadedCommand.is(data)) {
      const colorSet = data.colorPallete.map((v) => new Color(v.originalR, v.originalG, v.originalB, v.originalA, v.raw));
      const orderTable = colorSet.map((v, i) => i);
      const drawFlagTable = colorSet.map(() => false);

      this.setState({ colorSet: colorSet, orderTable: orderTable, drawFlagTable: drawFlagTable, needReconvert: true });
    } else if (ConvertResultCommand.is(data)) {
      this.setState((state) => {
        const l = state.luaCodes || [];
        l[data.metaData.offsetListIndex] = new LuaCodeSnippet(
          data.luaList.map(
            (v, i) => {
              const c = state.colorSet[state.orderTable[i]];
              if (v !== '') {
                return `C(${c.convertedR},${c.convertedG},${c.convertedB})` + v;
              } else {
                return '';
              }
            }
          ), this.state.luaCodeOption
        );
        return { ...state, luaCodes: l, convertProgress: data.metaData.finished / data.metaData.length };
      });
    } else if (EndConvertCommand.is(data)) {
      this.setState((state) => {
        const final = FinalizeLuaCode(state.luaCodes || [], state.luaCodeOption);

        return { ...state, generatedCode: final, isWorking: false, convertProgress: 1, needReconvert: false }
      });
    }
  }

  // ----- Unload Dialog
  componentDidMount() {
    window.addEventListener("beforeunload", this.handleBeforeUnloadEvent);
    this.restartWorker();
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnloadEvent);
  }

  handleBeforeUnloadEvent(evt: BeforeUnloadEvent) {
    if (this.state.imageUrl !== undefined) {
      evt.preventDefault();
    }
    evt.returnValue = "";
    this.state.worker?.terminate();
    this.state.subWorker?.terminate();
  }

  // ----- Other Change Event
  handleFileChange(file: File) {
    fileToU8Image(file, true).then((res) => {
      this.setState({ imageUrl: res.dataUrl, width: res.width, height: res.height });
      const cmd = new OpenFileCommand(res.u8Image, res.width, res.height, true);
      this.getWorker().postMessage(cmd, cmd.getTransfer());
    });
  }

  // 未チェック
  handleOnDrawChange(colorIndex: number, drawFlag: boolean) {
    let k = this.state.drawFlagTable.slice();
    k[colorIndex] = drawFlag;
    this.setState({ drawFlagTable: k });
  }

  handleOnMoveUpClick(colorIndex: number) {
    let k = this.state.orderTable.slice();
    let o = k[colorIndex];

    k[k.indexOf(o - 1)] = o;
    k[colorIndex] = o - 1;

    this.setState({ orderTable: k });
  }

  handleOnMoveDownClick(colorIndex: number) {
    let k = this.state.orderTable.slice();
    let o = k[colorIndex];

    k[k.indexOf(o + 1)] = o;
    k[colorIndex] = o + 1;

    this.setState({ orderTable: k });
  }

  handleOnColorChange(colorIndex: number, colorInput: string) {
    this.state.colorSet[colorIndex].setConvertedRGB(colorInput);
  }

  handleStartConvertClick() {
    this.setState((state) => {
      if (state.needReconvert) {
        const u = new Uint32Array(this.state.orderTable.length);
        for (let i = 0; i < this.state.orderTable.length; i++) {
          u[i] = this.state.colorSet[this.state.orderTable[i]].raw || 0;
        }
        const cmd = new StartConvertCommand(this.state.luaCodeOption, u);
        this.getWorker().postMessage(cmd, cmd.getTransfer());
        return { ...state, isWorking: true };
      } else {
        return state;
      }
    });
  }

  handleStopConvertClick() {
    const cmd = new TerminateConverterCommand();
    this.getWorker().postMessage(cmd, cmd.getTransfer());
    this.setState({ isWorking: false });
  }

  // 対応済み
  handleModalClose() {
    this.setState({ modalShow: '' });
  }

  handleChangeSettings(opt: LuaCodeOption, needReconvert: boolean = false) {
    this.setState((state) => {
      let ss: LuaCodeOption = state.luaCodeOption;
      for (const key in opt) {
        if (Object.prototype.hasOwnProperty.call(opt, key)) {
          (ss as any)[key] = (opt as any)[key];
        }
      }
      return { ...state, luaCodeOption: ss, needReconvert: needReconvert || state.needReconvert };
    });
  }

  render(): React.ReactNode {
    return (
      <>
        <Navbar collapseOnSelect expand="md" bg="light">
          <Container>
            <Navbar.Brand>Storm Kamishibai</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
              <Nav>
                <Nav.Link href='https://forms.gle/TRxMsVQLBrCc3yJF7'>問い合わせフォーム</Nav.Link>
                <Nav.Link onClick={() => { this.setState({ modalShow: 'help' }); }}>使い方</Nav.Link>
                <Nav.Link onClick={() => { this.setState({ modalShow: 'about' }); }}>このアプリについて</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container className='mb-4'>
          <Row>
            <Col md={6} className='mt-4'>
              <Stack gap={2}>
                <FileSelector
                  onFileChange={this.handleFileChange}
                  imageUrl={this.state.imageUrl}
                  width={this.state.width}
                  height={this.state.height} />
                <ConvertBox
                  isVisible={this.state.imageUrl !== ''}
                  isWorking={this.state.isWorking}
                  onStartConvertClick={this.handleStartConvertClick}
                  onStopConvertClick={this.handleStopConvertClick}
                  disableStartButton={this.state.imageUrl === ''}
                  convertProgress={this.state.convertProgress} />
                <LuaCode
                  isVisible={this.state.imageUrl !== ''}
                  code={this.state.generatedCode} />
              </Stack>
            </Col>
            <Col md={6} className='mt-4'>
              <LandingBox
                isVisible={this.state.imageUrl === ''} />
              <Settings
                isVisible={this.state.imageUrl !== ''}
                tab={{
                  changeSettings: this.handleChangeSettings,
                  luaCodeOption: this.state.luaCodeOption
                }}
                colorList={{
                  colorSet: this.state.colorSet,
                  colorOrder: this.state.orderTable,
                  undrawFlag: this.state.drawFlagTable,
                  onDrawFlagChange: this.handleOnDrawChange,
                  onMoveUpClick: this.handleOnMoveUpClick,
                  onMoveDownClick: this.handleOnMoveDownClick,
                  onColorChange: this.handleOnColorChange
                }} />
            </Col>
          </Row>
        </Container>
        <HelpModal show={this.state.modalShow === 'help'} onClose={this.handleModalClose} />
        <AboutModal show={this.state.modalShow === 'about'} onClose={this.handleModalClose} />
      </>
    );
  }
}

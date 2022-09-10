import React from 'react';
import { Container, Navbar, Row, Col, Stack, Nav } from 'react-bootstrap';

import FileSelector from './ui/FileSelector';
import LuaCode from './ui/LuaCode';
import ConvertBox from './ui/ConvertBox';

import LuaCodeOption, { getLuaCodeOptionDefault } from './LuaCodeOption';
import './App.scss';
import Settings from './ui/Settings';
import ConvertOption, { getConvertOptionDefault } from './ConvertOption';
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
  imageWidth: number;
  imageHeight: number;

  colorSet: Color[];
  orderTable: number[];
  transparentStartOrder: number;

  convertProgress: number;
  worker?: Worker;
  subWorker?: Worker;
  isWorking: boolean;

  needReconvert: boolean;
  luaCodes?: string[][];
  generatedCode: FinalLuaCode;

  convertOption: ConvertOption;
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
    this.handleChangeConvertSettings = this.handleChangeConvertSettings.bind(this);
    this.handleChangeLuaCodeSettings = this.handleChangeLuaCodeSettings.bind(this);
    this.handleApplySettingsClick = this.handleApplySettingsClick.bind(this);
    this.state = {
      convertProgress: 0, colorSet: [], orderTable: [], transparentStartOrder: 0, isWorking: false,
      generatedCode: new FinalLuaCode([]), convertOption: getConvertOptionDefault(),
      luaCodeOption: getLuaCodeOptionDefault(), modalShow: '',
      imageUrl: '', imageWidth: 0, imageHeight: 0, needReconvert: false
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

      this.setState({ colorSet: colorSet, orderTable: orderTable, transparentStartOrder: orderTable.length, needReconvert: true });
    } else if (ConvertResultCommand.is(data)) {
      this.setState((state) => {
        const l = state.luaCodes || [];
        l[data.metaData.offsetListIndex] = data.luaList;
        return { ...state, luaCodes: l, convertProgress: data.metaData.finished / data.metaData.length };
      });
    } else if (EndConvertCommand.is(data)) {
      this.setState((state) => {
        return { ...state, isWorking: false, convertProgress: 1, needReconvert: false }
      });
      this.handleApplySettingsClick();
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
      this.setState({ imageUrl: res.dataUrl, imageWidth: res.width, imageHeight: res.height });
      const cmd = new OpenFileCommand(res.u8Image, res.width, res.height, true);
      this.getWorker().postMessage(cmd, cmd.getTransfer());
    });
  }

  handleOnDrawChange(colorIndex: number, drawFlag: boolean) {
    this.setState((state) => {
      let k = state.orderTable.slice();
      let o = k[colorIndex];
      let to = state.transparentStartOrder;

      if (o < to && drawFlag) {
        k = k.map((v) => (v > o && v < to) ? v - 1 : v);
        k[colorIndex] = --to;
      } else if (o >= to && !drawFlag) {
        k = k.map((v) => (v >= to && v < o) ? v + 1 : v);
        k[colorIndex] = to++;
      }

      return { ...state,  orderTable: k, transparentStartOrder: to, needReconvert: true };
    });
  }

  handleOnMoveUpClick(colorIndex: number) {
    this.setState((state) => {
      let k = state.orderTable.slice();
      let o = k[colorIndex];

      k[k.indexOf(o - 1)] = o;
      k[colorIndex] = o - 1;

      return { ...state,  orderTable: k, needReconvert: true };
    });
  }

  handleOnMoveDownClick(colorIndex: number) {
    this.setState((state) => {
      let k = state.orderTable.slice();
      let o = k[colorIndex];

      k[k.indexOf(o + 1)] = o;
      k[colorIndex] = o + 1;

      return { ...state,  orderTable: k, needReconvert: true };
    });
  }

  handleOnColorChange(colorIndex: number, colorInput: string) {
    this.setState((state) => {
      let c = state.colorSet.slice();
      c[colorIndex].setConvertedRGB(colorInput);

      return { ...state, colorSet: c };
    });
  }

  handleStartConvertClick() {
    this.setState((state) => {
      if (state.needReconvert) {
        const u = new Uint32Array(state.orderTable.length);
        for (let i = 0; i < state.orderTable.length; i++) {
          u[state.orderTable[i]] = state.colorSet[i].raw || 0;
        }
        
        const cmd = new StartConvertCommand(state.convertOption, u, state.transparentStartOrder);
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

  handleApplySettingsClick() {
    this.setState((state) => {
      const u = new Array<Color>(state.orderTable.length);
      for (let i = 0; i < state.orderTable.length; i++) {
        u[state.orderTable[i]] = state.colorSet[i];
      }
      const final = FinalizeLuaCode(state.luaCodes || [], u, state.convertOption, state.luaCodeOption);
      return { ...state, generatedCode: final };
    });
  }

  // 対応済み
  handleModalClose() {
    this.setState({ modalShow: '' });
  }

  handleChangeConvertSettings(opt: ConvertOption, needReconvert: boolean = false) {
    this.setState((state) => {
      let ss: ConvertOption = state.convertOption;
      for (const key in opt) {
        if (Object.prototype.hasOwnProperty.call(opt, key)) {
          if (!Object.prototype.hasOwnProperty.call(ss, key)) {
            throw '設定エラー: ConvertOptionに' + key + 'というキーはありません';
          }
          (ss as any)[key] = (opt as any)[key];
        }
      }
      return { ...state, convertOption: ss, needReconvert: needReconvert || state.needReconvert };
    });
  }

  handleChangeLuaCodeSettings(opt: LuaCodeOption) {
    this.setState((state) => {
      let ss: LuaCodeOption = state.luaCodeOption;
      for (const key in opt) {
        if (Object.prototype.hasOwnProperty.call(opt, key)) {
          if (!Object.prototype.hasOwnProperty.call(ss, key)) {
            throw '設定エラー: LuaCodeOptionに' + key + 'というキーはありません';
          }
          (ss as any)[key] = (opt as any)[key];
        }
      }
      return { ...state, luaCodeOption: ss };
    });
  }

  render(): React.ReactNode {
    return (
      <>
        <Navbar collapseOnSelect expand="md" bg="light">
          <Container className="px-5" fluid="xl">
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
        <Container className='px-5 mb-4' fluid="xl">
          <Row>
            <Col md={4} lg={6} className='mt-4'>
              <Stack gap={2}>
                <FileSelector
                  onFileChange={this.handleFileChange}
                  imageUrl={this.state.imageUrl}
                  width={this.state.imageWidth}
                  height={this.state.imageHeight} />
                <ConvertBox
                  isVisible={this.state.imageUrl !== ''}
                  isWorking={this.state.isWorking}
                  onStartConvertClick={this.handleStartConvertClick}
                  onStopConvertClick={this.handleStopConvertClick}
                  onApplyClick={this.handleApplySettingsClick}
                  needReconvert={this.state.needReconvert}
                  convertProgress={this.state.convertProgress} />
                <LuaCode
                  isVisible={this.state.imageUrl !== ''}
                  code={this.state.generatedCode} />
              </Stack>
            </Col>
            <Col md={8} lg={6} className='mt-4'>
              <LandingBox
                isVisible={this.state.imageUrl === ''} />
              <Settings
                isVisible={this.state.imageUrl !== ''}
                main={{
                  changeConvertSettings: this.handleChangeConvertSettings,
                  changeLuaCodeSettings: this.handleChangeLuaCodeSettings,
                  luaCodeOption: this.state.luaCodeOption,
                  convertOption: this.state.convertOption,
                  colorSet: this.state.colorSet,
                  colorOrder: this.state.orderTable,
                  transparentStartOrder: this.state.transparentStartOrder,
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

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
import WorkerCommand from './worker/WorkerCommand';
import ConvertCardCommand from './worker/ConvertCardCommand';
import ConvertSucceedCommand from './worker/ConvertSucceedCommand';
import TerminateConverterCommand from './worker/TerminateConverterCommand';
import StartConvertCommand from './worker/StartConvertCommand';
import OpenFileCommand from './worker/OpenFileCommand';

type AppState = {
  pictureData?: PictureData;

  orderTable: number[];
  drawFlagTable: boolean[];

  convertProgress: number;
  worker?: Worker;
  subWorker?: Worker;
  isWorking: boolean;

  luaCodes?: Array<LuaCodeSnippet>;
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
      convertProgress: 0, orderTable: [], drawFlagTable: [], isWorking: false,
      generatedCode: new FinalLuaCode([]), luaCodeOption: getDefault(), modalShow: ''
    };
  }

  // ----- WebWorker
  restartWorker() {
    this.state.worker?.terminate();
    const _worker = new Worker(new URL('./gencode/GenCode.ts', import.meta.url));
    _worker.onmessage = this.handleWorkerMessage.bind(this);
    this.setState({worker: _worker});
    return _worker;
  }

  getWorker() {
    return this.state?.worker || this.restartWorker();
  }

  handleWorkerMessage(evt: MessageEvent<WorkerCommand>) {
    const data = evt.data;

    if (data instanceof ConvertCardCommand) {
      let _subworker = this.state.subWorker;
      if (!_subworker) {
        _subworker = new Worker(new URL('./gencode/GenCode.ts', import.meta.url));
        _subworker.onmessage = this.handleWorkerMessage.bind(this);
        this.setState({subWorker: _subworker});
      }
      data.post(_subworker);

    } else if (data instanceof TerminateConverterCommand) {
      this.state.subWorker?.terminate();
      this.setState({subWorker: undefined});

    } else if (data instanceof ConvertSucceedCommand) {
      data.post(this.getWorker());

    }
  }

  // ----- Unload Dialog
  componentDidMount() {
    window.addEventListener("beforeunload", this.handleBeforeUnloadEvent);
    this.restartWorker();
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnloadEvent);
    this.state.worker?.terminate();
    this.state.subWorker?.terminate();
  }

  handleBeforeUnloadEvent(evt: BeforeUnloadEvent) {
    if (this.state.pictureData !== undefined) {
      evt.preventDefault();
    }
    evt.returnValue = "";
  }

  // ----- Other Change Event
  handleFileChange(_pictureData: PictureData) {
    let a = _pictureData.colorSet.map((v, i) => i);
    let b = new Array<boolean>(_pictureData.colorSet.length);
    b = b.fill(false);
    this.setState({ pictureData: _pictureData, orderTable: a, drawFlagTable: b });

    //(new OpenFileCommand()).post(this.getWorker());
  }

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
    this.state.pictureData?.setConvertedRGB(colorIndex, colorInput);
    this.setState({ pictureData: this.state.pictureData });
  }

  handleStartConvertClick() {
    (new StartConvertCommand({}, {})).post(this.getWorker());
  }

  handleStopConvertClick() {
    (new TerminateConverterCommand()).post(this.getWorker());
    this.setState({ isWorking: false });
  }

  // 対応済み
  handleModalClose() {
    this.setState({ modalShow: '' });
  }

  handleChangeSettings(opt: LuaCodeOption) {
    this.setState((state) => {
      for (const key in opt) {
        if (Object.prototype.hasOwnProperty.call(opt, key)) {
          (state.luaCodeOption as any)[key] = (opt as any)[key];
        }
      }
      return state;
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
                <FileSelector onFileChange={this.handleFileChange} />
                <ConvertBox
                  isVisible={this.state.pictureData !== undefined}
                  isWorking={this.state.isWorking}
                  onStartConvertClick={this.handleStartConvertClick}
                  onStopConvertClick={this.handleStopConvertClick}
                  disableStartButton={this.state.pictureData === undefined}
                  convertProgress={this.state.convertProgress} />
                <LuaCode
                  isVisible={this.state.pictureData !== undefined}
                  code={this.state.generatedCode} />
              </Stack>
            </Col>
            <Col md={6} className='mt-4'>
              <LandingBox
                isVisible={this.state.pictureData === undefined} />
              <Settings
                isVisible={this.state.pictureData !== undefined}
                tab={{
                  changeSettings: this.handleChangeSettings,
                  luaCodeOption: this.state.luaCodeOption
                }}
                colorList={{
                  colorSet: this.state.pictureData?.colorSet,
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

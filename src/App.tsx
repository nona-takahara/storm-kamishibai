import React from 'react';
import { Container, Navbar, Row, Col, Stack, Nav } from 'react-bootstrap';

import ConvertCommand from './gencode/ConvertCommand';
import Results from './gencode/Results';
import ConvertedData from './gencode/ConvertedData';

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

type AppState = {
  pictureData?: PictureData;

  orderTable: number[];
  drawFlagTable: boolean[];

  convertProgress: number;
  worker?: Worker;
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

  restartWorker() {
    this.state.worker?.terminate();
    const _worker = new Worker(new URL('./gencode/GenCode.ts', import.meta.url));
    _worker.onmessage = this.handleWorkerMessage.bind(this);
    this.setState({worker: _worker});
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.handleBeforeUnloadEvent);
    this.restartWorker();
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnloadEvent);
  }

  handleBeforeUnloadEvent(evt: BeforeUnloadEvent) {
    if (this.state.pictureData !== undefined) {
      evt.preventDefault();
    }
    evt.returnValue = "";
  }

  handleFileChange(_pictureData: PictureData) {
    let a = _pictureData.colorSet.map((v, i) => i);
    let b = new Array<boolean>(_pictureData.colorSet.length);
    b = b.fill(false);
    this.setState({ pictureData: _pictureData, orderTable: a, drawFlagTable: b });
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
    if (this.state.pictureData !== undefined) {
      //const _worker = new Worker(new URL('./gencode/GenCode.ts', import.meta.url));
      let m = new ConvertCommand(
        this.state.pictureData, this.state.orderTable, this.state.drawFlagTable, this.state.luaCodeOption.width, this.state.luaCodeOption.height);
      this.state.worker?.postMessage(m, m.getTransfer());
      this.setState({ isWorking: true, convertProgress: 0, luaCodes: undefined });
    }
  }

  handleWorkerMessage(evt: MessageEvent<Results>) {
    if (evt.data.result !== undefined) {
      let data = evt.data.result as ConvertedData;
      let code = this.state.luaCodes?.slice() || new Array<LuaCodeSnippet>();
      code[data.index] = code[data.index] || new LuaCodeSnippet(this.state.luaCodeOption);
      code[data.index].push(data.convertedData, data.color, data.layer);
      this.setState({ luaCodes: code });
    }
    if (evt.data.working === false) {
      // 終了処理
      this.setState({ isWorking: false, generatedCode: FinalizeLuaCode(this.state.luaCodes || [], this.state.luaCodeOption) });
      //this.state.worker?.terminate();
    }
    this.setState({ convertProgress: evt.data.progress });
  }

  handleStopConvertClick() {
    this.restartWorker();
    this.setState({ isWorking: false });
  }

  handleModalClose() {
    this.setState({ modalShow: '' });
  }

  handleChangeSettings(opt: LuaCodeOption) {
    this.setState((state) => {
      const oldOpt = state.luaCodeOption;
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

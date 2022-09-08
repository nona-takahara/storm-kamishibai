import React, { ChangeEvent } from "react";
import { Button, ButtonGroup, Card, Form, FormControl, InputGroup, ListGroup, Stack, Tab } from "react-bootstrap";
import Color from "../Color";
import LuaCodeOption from "../LuaCodeOption";
import Lut from "../Lut";
import ColorBox from "./ColorBox";
import ColorBoxOverlays from "./ColorBoxOverlays";

export type MainSettingTabProps = {
  changeSettings: (v: LuaCodeOption | any, needReconvert?: boolean) => any;
  luaCodeOption: LuaCodeOption;
  colorSet?: Array<Color>;
  colorOrder: number[];
  undrawFlag: boolean[];
  onColorChange: Function;
  onDrawFlagChange: Function;
  onMoveUpClick: Function;
  onMoveDownClick: Function;
}

export default class MainSettingTab extends React.Component<MainSettingTabProps> {
  constructor(props: MainSettingTabProps) {
    super(props);

    this.handleChangeWidth = this.handleChangeWidth.bind(this);
    this.handleChangeHeight = this.handleChangeHeight.bind(this);
  }

  handleChangeWidth(evt: ChangeEvent<any>) {
    this.props.changeSettings({ luaCardWidth: Number(evt.target.value) }, true);
  }

  handleChangeHeight(evt: ChangeEvent<any>) {
    this.props.changeSettings({ luaCardHeight: Number(evt.target.value) }, true);
  }


  handleColorChange(index: number, evt: React.ChangeEvent) {
    this.props.onColorChange(index, (evt.target as any).value);
  }

  handleMoveUpClick(index: number, evt: React.MouseEvent) {
    evt.preventDefault();
    this.props.onMoveUpClick(index);
  }

  handleMoveDownClick(index: number, evt: React.MouseEvent) {
    evt.preventDefault();
    this.props.onMoveDownClick(index);
  }

  handleDrawFlagChange(index: number, evt: React.ChangeEvent) {
    this.props.onDrawFlagChange(index, !((evt.target as any).checked));
  }

  render() {
    let k: any = false
    if (this.props.colorSet !== undefined) {
      k = new Array(this.props.colorSet.length);
      for (let i = 0; i < this.props.colorSet.length; i++) {
        const v = this.props.colorSet[i];
        k[this.props.colorOrder[i]] = (
          <ListGroup.Item key={i} variant={this.props.undrawFlag[i] ? 'secondary' : ''}>
            <Stack direction='horizontal' gap={2}>
              <Stack direction='horizontal' gap={2}>
                <ColorBoxOverlays r={v.originalR} g={v.originalG} b={v.originalB} />
                <div>→</div>
                <ColorBox r={Lut[v.convertedR]} g={Lut[v.convertedG]} b={Lut[v.convertedB]} />
              </Stack>
              <Form.Control
                type='text'
                defaultValue={rgb2hex(v.convertedR, v.convertedG, v.convertedB)}
                onChange={(e) => this.handleColorChange(i, e)}
              />
              <div className='ms-auto' />
              <Form.Check className='ms-auto' type='switch' onChange={(e) => this.handleDrawFlagChange(i, e)} checked={!this.props.undrawFlag[i]} />
              <div className='vr' />
              <ButtonGroup>
                <Button variant='secondary' size='sm' onClick={(e) => this.handleMoveUpClick(i, e)} disabled={this.props.colorOrder[i] === 0}>↑</Button>
                <Button variant='secondary' size='sm' onClick={(e) => this.handleMoveDownClick(i, e)} disabled={this.props.colorOrder[i] === (this.props.colorSet.length - 1)}>↓</Button>
              </ButtonGroup>
            </Stack>
          </ListGroup.Item>
        );
      }
    }
    return (
      <Stack gap={2}>
        <InputGroup>
          <InputGroup.Text>幅</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaCardWidth}
            onChange={this.handleChangeWidth} />
          <InputGroup.Text>&#xd7;</InputGroup.Text>
          <InputGroup.Text>高さ</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaCardHeight}
            onChange={this.handleChangeHeight} />
        </InputGroup>
        <Card>
          <Card.Header>
            色の重ね順序
          </Card.Header>
          <Card.Body className="p-0">
            <ListGroup variant='flush'>
              {k}
            </ListGroup>
          </Card.Body>
        </Card>
      </Stack>
    );
  }
}

function rgb2hex(...rgb: Array<number>) {
  return "#" + rgb.map(function (value) {
    return ("0" + value.toString(16)).slice(-2);
  }).join("");
}
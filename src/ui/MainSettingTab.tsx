import React, { ChangeEvent } from "react";
import { Button, ButtonGroup, Card, Col, FloatingLabel, Form, FormControl, InputGroup, ListGroup, Row, Stack, Tab } from "react-bootstrap";
import Color from "../Color";
import LuaCodeOption from "../LuaCodeOption";
import Lut from "../Lut";
import ColorBox from "./ColorBox";
import ColorBoxOverlays from "./ColorBoxOverlays";
import ColorListItem from "./ColorListItem";
import LabeledInput from "./util/LabeledInput";

export type MainSettingTabProps = {
  changeSettings: (v: LuaCodeOption | any, needReconvert?: boolean) => any;
  luaCodeOption: LuaCodeOption;
  colorSet?: Array<Color>;
  colorOrder: number[];
  transparentStartOrder: number;
  onColorChange: Function;
  onDrawFlagChange: Function;
  onMoveUpClick: Function;
  onMoveDownClick: Function;
}

export default class MainSettingTab extends React.Component<MainSettingTabProps> {
  constructor(props: MainSettingTabProps) {
    super(props);
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
        const undraw = this.props.colorOrder[i] >= this.props.transparentStartOrder;
        k[this.props.colorOrder[i]] = (
          <ListGroup.Item key={i} variant={undraw ? 'secondary' : ''}>
            <ColorListItem
              order={this.props.colorOrder[i]}
              orderListLength={this.props.transparentStartOrder}
              undrawFlag={undraw}
              color={this.props.colorSet[i]}
              onColorChange={(e) => this.handleColorChange(i, e)}
              onDrawFlagChange={(e) => this.handleDrawFlagChange(i, e)}
              onMoveUpClick={(e) => this.handleMoveUpClick(i, e)}
              onMoveDownClick={(e) => this.handleMoveDownClick(i, e)}
            /></ListGroup.Item>);
      }
    }
    return (
      <Stack gap={2}>
        <Card>
          <Card.Header>
            画像切り抜き設定
          </Card.Header>
          <Card.Body>
            <Stack gap={1}>
              <Row>
                <Form.Label column xs={2}>
                  サイズ
                </Form.Label>
                <Col>
                  <InputGroup>
                    <LabeledInput
                      label="幅"
                      type="number"
                      defaultValue={this.props.luaCodeOption.luaCardWidth}
                      onChange={(e) => {
                        this.props.changeSettings({ luaCardWidth: Number(e.target.value) }, true);
                      }} />
                    <LabeledInput
                      label="高さ"
                      type="number"
                      defaultValue={this.props.luaCodeOption.luaCardHeight}
                      onChange={(e) => {
                        this.props.changeSettings({ luaCardHeight: Number(e.target.value) }, true);
                      }} />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Form.Label column xs={2}>
                  開始位置
                </Form.Label>
                <Col>
                  <InputGroup>
                    <LabeledInput
                      label="X"
                      type="number"
                      defaultValue={this.props.luaCodeOption.pictureOffsetX}
                      onChange={(e) => {
                        this.props.changeSettings({ pictureOffsetX: Number(e.target.value) }, true);
                      }} />
                    <LabeledInput
                      label="Y"
                      type="number"
                      defaultValue={this.props.luaCodeOption.pictureOffsetY}
                      onChange={(e) => {
                        this.props.changeSettings({ pictureOffsetY: Number(e.target.value) }, true);
                      }} />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Form.Label column xs={2}>
                  スキップ
                </Form.Label>
                <Col>
                  <InputGroup>
                    <LabeledInput
                      label="水平"
                      type="number"
                      defaultValue={this.props.luaCodeOption.pictureSkipH}
                      onChange={(e) => {
                        this.props.changeSettings({ pictureSkipH: Number(e.target.value) }, true);
                      }} />
                    <LabeledInput
                      label="垂直"
                      type="number"
                      defaultValue={this.props.luaCodeOption.pictureSkipV}
                      onChange={(e) => {
                        this.props.changeSettings({ pictureSkipV: Number(e.target.value) }, true);
                      }} />
                  </InputGroup>
                </Col>
              </Row>
            </Stack>
          </Card.Body>
        </Card>
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


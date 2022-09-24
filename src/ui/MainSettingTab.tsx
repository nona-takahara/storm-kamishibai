import React from "react";
import { Alert, Card, Col, Form, InputGroup, ListGroup, Row, Stack } from "react-bootstrap";
import Color from "../Color";
import ConvertOption from "../ConvertOption";
import ColorListItem from "./ColorListItem";
import LabeledInput from "./util/LabeledInput";
import LuaCodeOption from "../LuaCodeOption";
import { BsExclamationCircle } from "react-icons/bs";

export type MainSettingTabProps = {
  changeConvertSettings: (v: ConvertOption | any, needReconvert?: boolean) => any;
  changeLuaCodeSettings: (v: LuaCodeOption | any) => any;
  luaCodeOption: LuaCodeOption;
  convertOption: ConvertOption;
  colorSet?: Array<Color>;
  colorOrder: number[];
  transparentStartOrder: number;
  onColorChange: Function;
  onDrawFlagChange: Function;
  onMoveUpClick: Function;
  onMoveDownClick: Function;
}

export default class MainSettingTab extends React.Component<MainSettingTabProps> {
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
        //const v = this.props.colorSet[i];
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
        <Alert variant="info" className="mb-0">
          <Row>
            <Col xs="auto" className="pe-0">
              <BsExclamationCircle />
            </Col>
            <Col>
              この解析オプションを変更すると再度解析が必要になります。
            </Col>
          </Row>
        </Alert>
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
                <InputGroup as={Col}>
                  <LabeledInput
                    label="幅"
                    type="number"
                    defaultValue={this.props.convertOption.luaCardWidth}
                    onChange={(e) => {
                      this.props.changeConvertSettings({ luaCardWidth: Number(e.target.value) }, true);
                    }} />
                  <LabeledInput
                    label="高さ"
                    type="number"
                    defaultValue={this.props.convertOption.luaCardHeight}
                    onChange={(e) => {
                      this.props.changeConvertSettings({ luaCardHeight: Number(e.target.value) }, true);
                    }} />
                </InputGroup>
              </Row>
              <Row className="mt-3">
                <Form.Label column xs={2}>
                  開始位置
                </Form.Label>
                <InputGroup as={Col}>
                  <LabeledInput
                    label="X"
                    type="number"
                    defaultValue={this.props.convertOption.pictureOffsetX}
                    onChange={(e) => {
                      this.props.changeConvertSettings({ pictureOffsetX: Number(e.target.value) }, true);
                    }} />
                  <LabeledInput
                    label="Y"
                    type="number"
                    defaultValue={this.props.convertOption.pictureOffsetY}
                    onChange={(e) => {
                      this.props.changeConvertSettings({ pictureOffsetY: Number(e.target.value) }, true);
                    }} />
                </InputGroup>
              </Row>
              <Row>
                <Form.Label column xs={2}>
                  スキップ
                </Form.Label>
                <InputGroup as={Col}>
                  <LabeledInput
                    label="水平"
                    type="number"
                    defaultValue={this.props.convertOption.pictureSkipH}
                    onChange={(e) => {
                      this.props.changeConvertSettings({ pictureSkipH: Number(e.target.value) }, true);
                    }} />
                  <LabeledInput
                    label="垂直"
                    type="number"
                    defaultValue={this.props.convertOption.pictureSkipV}
                    onChange={(e) => {
                      this.props.changeConvertSettings({ pictureSkipV: Number(e.target.value) }, true);
                    }} />
                </InputGroup>
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


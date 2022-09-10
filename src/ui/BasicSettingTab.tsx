import React from "react";
import { Card, InputGroup, Row, Col, FormControl, Stack, Form, Alert, ButtonGroup, ToggleButton } from "react-bootstrap";
import { BsArrowDownSquareFill, BsArrowLeftSquareFill, BsArrowRightSquareFill, BsArrowUpSquareFill, BsExclamationCircle } from "react-icons/bs";
import ConvertOption from "../ConvertOption";
import LuaCodeOption from "../LuaCodeOption";
import LabeledInput from "./util/LabeledInput";

export type BasicSettingTabProps = {
  changeLuaCodeSettings: (v: LuaCodeOption | any, needReconvert?: boolean) => any;
  convertOption: ConvertOption;
  luaCodeOption: LuaCodeOption;
}

type BasicSettingTabState = {
}

export default class BasicSettingTab extends React.Component<BasicSettingTabProps, BasicSettingTabState> {
  constructor(props: BasicSettingTabProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Stack gap={2}>
        <Card>
          <Card.Body>
            <Stack gap={2}>
              <Form.Check type="checkbox">
                <Form.Check.Input
                  type="checkbox"
                  id="rollsign"
                  defaultChecked={this.props.luaCodeOption.isRollSign}
                  onChange={(evt) => { this.props.changeLuaCodeSettings({ isRollSign: evt.target.checked }); }} />
                <Form.Check.Label htmlFor="rollsign">巻取り字幕モード</Form.Check.Label>
              </Form.Check>
              <Card.Text>
                <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2850204940" target="_blank">Analog Destination Indicator(Rollsign)</a>
                用の変換結果を出力します。<br />以下の一部設定は無効となります。
              </Card.Text>
              <Form.Group as={Row}>
                <Form.Label column xs={3}>幕間の隙間</Form.Label>
                <Col>
                  <FormControl
                    type="number"
                    defaultValue={this.props.luaCodeOption.luaRollSignGap}
                    disabled={!this.props.luaCodeOption.isRollSign}
                    onChange={(evt) => { this.props.changeLuaCodeSettings({ luaRollSignGap: Number(evt.target.value) }); }} />
                </Col>
              </Form.Group>
              {(this.props.luaCodeOption.isRollSign && ((this.props.convertOption.luaCardHeight + this.props.luaCodeOption.luaRollSignGap) !== 32)) ? (<Alert variant="warning" className="mb-0">
                <Row>
                  <Col xs="auto" className="pe-0">
                    <BsExclamationCircle />
                  </Col>
                  <Col>
                    切り抜き高さと幕間の隙間の和が32以外になる際は、SelectorマイコンのLuaコードを改造する必要があります。
                  </Col>
                </Row>
              </Alert>) : <></>}
            </Stack>
          </Card.Body>
        </Card>
        <Form.Group as={Row}>
          <Form.Label column xs={4}>先頭の画像インデックス</Form.Label>
          <Col>
            <Form.Control
              type="number"
              defaultValue={this.props.luaCodeOption.luaCardIndexStartWith}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => { this.props.changeLuaCodeSettings({ luaCardIndexStartWith: Number(evt.target.value) }); }} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column xs={4}>読み込む数値チャンネル</Form.Label>
          <Col>
            <Form.Control
              type="number"
              defaultValue={this.props.luaCodeOption.luaReadChannel}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => { this.props.changeLuaCodeSettings({ luaReadChannel: Number(evt.target.value) }); }} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column xs={4}>1ブロックの最大文字数<br />(最大4096)</Form.Label>
          <Col>
            <Form.Control
              type="number"
              defaultValue={this.props.luaCodeOption.luaMaxLength}
              onChange={(evt) => { this.props.changeLuaCodeSettings({ luaMaxLength: Number(evt.target.value) }); }} />
          </Col>
        </Form.Group>
        <Row>
          <Form.Label column xs={2}>
            描画<br />オフセット
          </Form.Label>
          <InputGroup as={Col}>
            <LabeledInput
              label="左側"
              type="number"
              defaultValue={this.props.luaCodeOption.luaOffsetX}
              onChange={(evt) => { this.props.changeLuaCodeSettings({ luaOffsetX: Number(evt.target.value) }); }} />
            <LabeledInput
              label="上側"
              type="number"
              defaultValue={this.props.luaCodeOption.luaOffsetY}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => { this.props.changeLuaCodeSettings({ luaOffsetY: Number(evt.target.value) }); }} />
          </InputGroup>
        </Row>
        <Row>
          <Form.Label column xs={2}>
            描画倍率
          </Form.Label>
          <InputGroup as={Col}>
            <LabeledInput
              label="水平"
              type="number"
              defaultValue={this.props.luaCodeOption.luaScaleH}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => { this.props.changeLuaCodeSettings({ luaScaleH: Number(evt.target.value) }); }} />
            <LabeledInput
              label="垂直"
              type="number"
              defaultValue={this.props.luaCodeOption.luaScaleV}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => { this.props.changeLuaCodeSettings({ luaScaleV: Number(evt.target.value) }); }} />
          </InputGroup>
        </Row>
        <Row>
          <Col xs={2}>回転</Col>
          <Col className="d-grid">
            <ButtonGroup>
              {[
                { name: <BsArrowLeftSquareFill />, value: 90 },
                { name: <BsArrowUpSquareFill />, value: 0 },
                { name: <BsArrowRightSquareFill />, value: 270 },
                { name: <BsArrowDownSquareFill />, value: 180 }
              ].map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant='outline-secondary'
                  name="radio"
                  className='fs-5'
                  disabled={this.props.luaCodeOption.isRollSign}
                  value={radio.value}
                  checked={this.props.luaCodeOption.luaRotate === radio.value}
                  onChange={(evt) => { this.props.changeLuaCodeSettings({ luaRotate: Number(evt.target.value) }) }}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>
        </Row>
      </Stack>);
  }
}
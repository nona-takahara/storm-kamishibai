import React, { ChangeEvent } from "react";
import { Card, InputGroup, Row, Col, Button, FormControl, Stack, Form } from "react-bootstrap";
import ConvertOption from "../ConvertOption";
import LuaCodeOption from "../LuaCodeOption";

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
          <Form.Check type="checkbox">
            <Form.Check.Input 
              type="checkbox"
              defaultChecked={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => {this.props.changeLuaCodeSettings({ isRollSign: evt.target.checked }); }} />
            <Form.Check.Label>巻取り字幕モード</Form.Check.Label>
          </Form.Check>
          <Card.Text>
            <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2850204940" target="_blank">Analog Destination Indicator(Rollsign)</a>
            用の変換結果を出力します。<br />現時点では、以下の設定は無効化されます。
          </Card.Text>
          </Card.Body>
        </Card>
        <InputGroup>
          <InputGroup.Text>先頭の画像インデックス</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaCardIndexStartWith}
            disabled={this.props.luaCodeOption.isRollSign}
            onChange={(evt) => {this.props.changeLuaCodeSettings({ luaCardIndexStartWith: Number(evt.target.value) }); }} />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>読み込む数値チャンネル</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaReadChannel}
            disabled={this.props.luaCodeOption.isRollSign}
            onChange={(evt) => {this.props.changeLuaCodeSettings({ luaReadChannel: Number(evt.target.value) }); }} />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>左側<br />オフセット</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaOffsetX}
            disabled={this.props.luaCodeOption.isRollSign}
            onChange={(evt) => {this.props.changeLuaCodeSettings({ luaOffsetX: Number(evt.target.value) }); }} />
          <InputGroup.Text>上側<br />オフセット</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaOffsetY}
            disabled={this.props.luaCodeOption.isRollSign}
            onChange={(evt) => {this.props.changeLuaCodeSettings({ luaOffsetY: Number(evt.target.value) });}} />
        </InputGroup>
      </Stack>);
  }
}
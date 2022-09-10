import React, { ChangeEvent } from "react";
import { Card, InputGroup, Row, Col, Button, FormControl, Stack } from "react-bootstrap";
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

    this.handleChannelChanged = this.handleChannelChanged.bind(this);
    this.handleStartWithChanged = this.handleStartWithChanged.bind(this);
    this.handleOffsetXChanged = this.handleOffsetXChanged.bind(this);
    this.handleOffsetYChanged = this.handleOffsetYChanged.bind(this);

    this.state = {};
  }

  handleStartWithChanged(evt: ChangeEvent<any>) {
    this.props.changeLuaCodeSettings({ luaCardIndexStartWith: Number(evt.target.value) });
  }

  handleChannelChanged(evt: ChangeEvent<any>) {
    this.props.changeLuaCodeSettings({ luaReadChannel: Number(evt.target.value) });
  }

  handleOffsetXChanged(evt: ChangeEvent<any>) {
    this.props.changeLuaCodeSettings({ luaOffsetX: Number(evt.target.value) });
  }

  handleOffsetYChanged(evt: ChangeEvent<any>) {
    this.props.changeLuaCodeSettings({ luaOffsetY: Number(evt.target.value) });
  }

  render() {
    return (
      <Stack gap={2}>
        <InputGroup>
          <InputGroup.Text>先頭の画像インデックス</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaCardIndexStartWith}
            onChange={this.handleStartWithChanged} />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>読み込む数値チャンネル</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaReadChannel}
            onChange={this.handleChannelChanged} />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>左側<br />オフセット</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaOffsetX}
            onChange={this.handleOffsetXChanged} />
          <InputGroup.Text>上側<br />オフセット</InputGroup.Text>
          <FormControl
            type="number"
            defaultValue={this.props.luaCodeOption.luaOffsetY}
            onChange={this.handleOffsetYChanged} />
        </InputGroup>
      </Stack>);
  }
}
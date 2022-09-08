import React, { ChangeEvent } from "react";
import { Card, InputGroup, Row, Col, Button, FormControl, Stack } from "react-bootstrap";
import LuaCodeOption from "../LuaCodeOption";

export type BasicSettingTabProps = {
  changeSettings: (v: LuaCodeOption | any, needReconvert?: boolean) => any;
  luaCodeOption: LuaCodeOption;
}

type BasicSettingTabState = {
  luaCodeTemplateA: string;
  luaCodeTemplateB: string;
}

export default class BasicSettingTab extends React.Component<BasicSettingTabProps, BasicSettingTabState> {
  constructor(props: BasicSettingTabProps) {
    super(props);

    this.handleChannelChanged = this.handleChannelChanged.bind(this);
    this.handleStartWithChanged = this.handleStartWithChanged.bind(this);
    this.handleOffsetXChanged = this.handleOffsetXChanged.bind(this);
    this.handleOffsetYChanged = this.handleOffsetYChanged.bind(this);

    this.state = {
      luaCodeTemplateA: `function R(x,y,w,h)S.drawRectF(x,y,w,h)end
function V(x,y,h)R(x,y,1,h)end
function W`, luaCodeTemplateB: ''
    };
  }

  handleStartWithChanged(evt: ChangeEvent<any>) {
    this.props.changeSettings({ luaCardIndexStartWith: Number(evt.target.value) });
  }

  handleChannelChanged(evt: ChangeEvent<any>) {
    this.props.changeSettings({ luaReadChannel: Number(evt.target.value) });
  }

  handleOffsetXChanged(evt: ChangeEvent<any>) {
    this.props.changeSettings({ luaOffsetX: Number(evt.target.value) });
  }

  handleOffsetYChanged(evt: ChangeEvent<any>) {
    this.props.changeSettings({ luaOffsetY: Number(evt.target.value) });
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
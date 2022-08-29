import React, { ChangeEvent } from "react";
import { Card, InputGroup, Row, Col, Button, FormControl, Stack } from "react-bootstrap";
import LuaCodeOption from "../LuaCodeOption";

type SettingsProps = {
  changeSettings: Function;
  luaCodeOption: LuaCodeOption;
}

type SettingsState = {
  luaCodeTemplateA: string;
  luaCodeTemplateB: string;
}

export default class Settings extends React.Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);

    this.handleChangeWidth = this.handleChangeWidth.bind(this);
    this.handleChangeHeight = this.handleChangeHeight.bind(this);
    this.handleChannelChanged = this.handleChannelChanged.bind(this);
    this.handleStartWithChanged = this.handleStartWithChanged.bind(this);
    this.handleOffsetXChanged = this.handleOffsetXChanged.bind(this);
    this.handleOffsetYChanged = this.handleOffsetYChanged.bind(this);

    this.state = { luaCodeTemplateA: `function R(x,y,w,h)S.drawRectF(x,y,w,h)end
function V(x,y,h)R(x,y,1,h)end
function W`, luaCodeTemplateB: '' };
  }

  handleChangeWidth(evt: ChangeEvent<any>) {
    this.props.changeSettings({ width: Number(evt.target.value) });
  }

  handleChangeHeight(evt: ChangeEvent<any>) {
    this.props.changeSettings({ height: Number(evt.target.value) });
  }

  handleStartWithChanged(evt: ChangeEvent<any>) {
    this.props.changeSettings({ startWith: Number(evt.target.value) });
  }

  handleChannelChanged(evt: ChangeEvent<any>) {
    this.props.changeSettings({ readChannel: Number(evt.target.value) });
  }

  handleOffsetXChanged(evt: ChangeEvent<any>) {
    this.props.changeSettings({ offsetX: Number(evt.target.value) });
  }

  handleOffsetYChanged(evt: ChangeEvent<any>) {
    this.props.changeSettings({ offsetY: Number(evt.target.value) });
  }

  render() {
    return (
      <Card>
        <Card.Header>
          設定
        </Card.Header>
        <Card.Body>
          <Stack gap={2}>
            <InputGroup>
              <InputGroup.Text>幅</InputGroup.Text>
              <FormControl
                type="number"
                defaultValue={this.props.luaCodeOption.width}
                onChange={this.handleChangeHeight} />
              <InputGroup.Text>&#xd7;</InputGroup.Text>
              <InputGroup.Text>高さ</InputGroup.Text>
              <FormControl
                type="number"
                defaultValue={this.props.luaCodeOption.height}
                onChange={this.handleChangeHeight} />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>先頭の画像インデックス</InputGroup.Text>
              <FormControl
                type="number"
                defaultValue={this.props.luaCodeOption.startWith}
                onChange={this.handleStartWithChanged} />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>読み込む数値チャンネル</InputGroup.Text>
              <FormControl
                type="number"
                defaultValue={this.props.luaCodeOption.readChannel}
                onChange={this.handleChannelChanged} />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>左側<br />オフセット</InputGroup.Text>
              <FormControl
                type="number"
                defaultValue={this.props.luaCodeOption.offsetX}
                onChange={this.handleOffsetXChanged} />
              <InputGroup.Text>上側<br />オフセット</InputGroup.Text>
              <FormControl
                type="number"
                defaultValue={this.props.luaCodeOption.offsetY}
                onChange={this.handleOffsetYChanged} />
            </InputGroup>
          </Stack>
        </Card.Body>
      </Card>);
  }
}
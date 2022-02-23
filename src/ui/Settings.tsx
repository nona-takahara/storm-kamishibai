import React from "react";
import { Card, InputGroup, Row, Col, Button, FormControl, Stack } from "react-bootstrap";
import LuaCodeOption from "../LuaCodeOption";

type SettingsProps = {
  onWidthChanged: Function;
  onHeightChanged: Function;
  onChannelChanged: Function;
  onKamishibaiStartWithChanged: Function;
  onOffsetXChanged: Function;
  onOffsetYChanged: Function;
  luaCodeOption: LuaCodeOption;
}

type SettingsState = {
  luaCodeTemplateA: string;
  luaCodeTemplateB: string;
}

export default class Settings extends React.Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = { luaCodeTemplateA: `function R(x,y,w,h)S.drawRectF(x,y,w,h)end
function V(x,y,h)R(x,y,1,h)end
function W`, luaCodeTemplateB: '' };
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
              <FormControl type="number" defaultValue={this.props.luaCodeOption.width} onChange={(e) => this.props.onWidthChanged(Number(e.target.value))} />
              <InputGroup.Text>&#xd7;</InputGroup.Text>
              <InputGroup.Text>高さ</InputGroup.Text>
              <FormControl type="number" defaultValue={this.props.luaCodeOption.height} onChange={(e) => this.props.onHeightChanged(Number(e.target.value))} />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>先頭の画像インデックス</InputGroup.Text>
              <FormControl type="number" defaultValue={this.props.luaCodeOption.startWith} onChange={(e) => this.props.onKamishibaiStartWithChanged(Number(e.target.value))} />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>読み込む数値チャンネル</InputGroup.Text>
              <FormControl type="number" defaultValue={this.props.luaCodeOption.readChannel} onChange={(e) => this.props.onChannelChanged(Number(e.target.value))} />
            </InputGroup>
            <InputGroup>
              <InputGroup.Text>左側<br />オフセット</InputGroup.Text>
              <FormControl type="number" defaultValue={this.props.luaCodeOption.offsetX} onChange={(e) => this.props.onOffsetXChanged(Number(e.target.value))} />
              <InputGroup.Text>上側<br />オフセット</InputGroup.Text>
              <FormControl type="number" defaultValue={this.props.luaCodeOption.offsetY} onChange={(e) => this.props.onOffsetYChanged(Number(e.target.value))} />
            </InputGroup>
          </Stack>
        </Card.Body>
      </Card>);
  }
}
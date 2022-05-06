import React from "react";
import { Card, Col, InputGroup, Row, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import FinalLuaCode from "../gencode/FinalLuaCode";

type LuaCodeProps = {
  code: FinalLuaCode;
}

type LuaCodeState = {
  index: number;
}

export default class LuaCode extends React.Component<LuaCodeProps, LuaCodeState> {
constructor(props: LuaCodeProps) {
    super(props);
    this.state = { index: 0};
    this.handleOnClickUp = this.handleOnClickUp.bind(this);
    this.handleOnClickDown = this.handleOnClickDown.bind(this);
  }

  handleOnClickUp() {
    this.setState({index: Math.min(this.state.index + 1, this.props.code.codes.length - 1)});
  }

  handleOnClickDown() {
    this.setState({index: Math.max(this.state.index - 1, 0)});
  }

  render() {
    let i = Math.min(Math.max(this.state.index, 0), this.props.code.codes.length - 1);
    return (
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col xs="auto">
              生成Luaコード
            </Col>
            <Col xs="auto">
              <InputGroup>
                <Button variant="outline-secondary" onClick={this.handleOnClickDown}>&lt;</Button>
                <InputGroup.Text>{i + 1} / {this.props.code.codes.length}</InputGroup.Text>
                <Button variant="outline-secondary" onClick={this.handleOnClickUp}>&gt;</Button>
              </InputGroup>
            </Col>
            <Col xs="auto">
              {bytelen(this.props.code.codes[i] || "")} 文字
            </Col>
            {
              (this.props.code.overrun) ? (
                <Col xs="auto">
                  <OverlayTrigger overlay={<Tooltip><>生成されたコードが長いため、<br />Luaコードを分割しました。{(this.props.code.samecolordiv) ? (<><br />色設定も分散しています。</>) : (false)}</></Tooltip>}>
                    <Badge bg="warning" text="dark">!</Badge>
                  </OverlayTrigger>
                </Col>
              ) : ( false )
            }
          </Row>
        </Card.Header>
        <Card.Body as="textarea" className="font-monospace p-1" value={this.props.code.codes[this.state.index] || ""} readOnly={true}/>
      </Card>);
  }
}

function bytelen(s: string) {
  return (new Blob([s])).size;
}
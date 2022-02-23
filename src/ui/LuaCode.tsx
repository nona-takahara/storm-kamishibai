import React from "react";
import { Card, Col, InputGroup, Row, Button } from "react-bootstrap";

type LuaCodeProps = {
  code: string[];
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
    this.setState({index: Math.min(this.state.index + 1, this.props.code.length - 1)});
  }

  handleOnClickDown() {
    this.setState({index: Math.max(this.state.index - 1, 0)});
  }

  render() {
    let i = Math.min(Math.max(this.state.index, 0), this.props.code.length - 1);
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
                <InputGroup.Text>{i + 1} / {this.props.code.length}</InputGroup.Text>
                <Button variant="outline-secondary" onClick={this.handleOnClickUp}>&gt;</Button>
              </InputGroup>
            </Col>
            <Col xs="auto">
              {(this.props.code[i] || "").length} 文字
            </Col>
          </Row>
        </Card.Header>
        <Card.Body as="textarea" className="font-monospace p-1" value={this.props.code[this.state.index] || ""} readOnly={true}/>
      </Card>);
  }
}
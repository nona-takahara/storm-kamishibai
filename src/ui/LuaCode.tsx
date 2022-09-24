import React from "react";
import { Card, Col, InputGroup, Row, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsFillCaretLeftFill, BsFillCaretRightFill, BsDownload, BsFillExclamationTriangleFill } from "react-icons/bs";

import FinalLuaCode from "../gencode/FinalLuaCode";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type LuaCodeProps = {
  isVisible: boolean;
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
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  handleOnClickUp() {
    this.setState({index: Math.min(this.state.index + 1, this.props.code.codes.length - 1)});
  }

  handleOnClickDown() {
    this.setState({index: Math.max(this.state.index - 1, 0)});
  }

  handleDownloadClick() {
    let zip = new JSZip();
    for (let i = 0; i < this.props.code.codes.length; i++) {
      const c = this.props.code.codes[i];
      zip.file(`storm-kamishibai/data${i + 1}.lua`, c);
    }
    zip.generateAsync({type: "blob"}).then((content) => {
      saveAs(content, "generated-lua.zip");
    });
  }

  render() {
    let i = Math.min(Math.max(this.state.index, 0), this.props.code.codes.length - 1);
    return (this.props.isVisible && (
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col xs="auto">
              生成Luaコード
            </Col>
            <Col xs="auto">
              <InputGroup>
                <Button variant="outline-secondary" onClick={this.handleOnClickDown} disabled={i <= 0}><BsFillCaretLeftFill /></Button>
                <InputGroup.Text>{i + 1} / {this.props.code.codes.length}</InputGroup.Text>
                <Button variant="outline-secondary" onClick={this.handleOnClickUp} disabled={i >= (this.props.code.codes.length - 1)}><BsFillCaretRightFill /></Button>
              </InputGroup>
            </Col>
            <Col>
              {bytelen(this.props.code.codes[i] || "")} 文字
            </Col>
            {
              (this.props.code.overrun) ? (
                <Col xs="auto">
                  <OverlayTrigger overlay={<Tooltip><>生成されたコードが長いため、<br />Luaコードを分割しました。{(this.props.code.samecolordiv) ? (<><br />色設定も分散しています。</>) : (false)}</></Tooltip>}>
                    <div><BsFillExclamationTriangleFill className="fs-4 text-warning" /></div>
                  </OverlayTrigger>
                </Col>
              ) : ( false )
            }
            <Col xs="auto" className="justify-content-end">
              <Button variant="outline-primary" onClick={this.handleDownloadClick}><BsDownload /></Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body
          as="textarea"
          rows={12}
          className="font-monospace p-1"
          value={this.props.code.codes[this.state.index] || ""}
          readOnly={true}/>
      </Card>)) || <></>;
  }
}

function bytelen(s: string) {
  return (new Blob([s])).size;
}
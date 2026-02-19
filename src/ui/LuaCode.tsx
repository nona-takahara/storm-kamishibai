import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import {
  BsDownload,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
  BsFillExclamationTriangleFill,
} from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import FinalLuaCode from "../gencode/FinalLuaCode";

type LuaCodeProps = {
  isVisible: boolean;
  code: FinalLuaCode;
};

const LuaCode: React.FC<LuaCodeProps> = ({ isVisible, code }) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const i = useMemo(
    () => Math.min(Math.max(index, 0), Math.max(code.codes.length - 1, 0)),
    [index, code.codes.length],
  );

  const handleOnClickUp = useCallback(() => {
    setIndex((s) => Math.min(s + 1, code.codes.length - 1));
  }, [code.codes.length]);

  const handleOnClickDown = useCallback(() => {
    setIndex((s) => Math.max(s - 1, 0));
  }, []);

  const handleDownloadClick = useCallback(() => {
    const zip = new JSZip();
    for (let j = 0; j < code.codes.length; j++) {
      zip.file(`storm-kamishibai/data${j + 1}.lua`, code.codes[j]);
    }
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "generated-lua.zip");
    });
  }, [code.codes]);

  if (!isVisible) return <></>;

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col xs="auto">{t("luaCode.title")}</Col>
          <Col xs="auto">
            <InputGroup>
              <Button
                variant="outline-secondary"
                onClick={handleOnClickDown}
                disabled={i <= 0}
              >
                <BsFillCaretLeftFill />
              </Button>
              <InputGroup.Text>
                {i + 1} / {code.codes.length}
              </InputGroup.Text>
              <Button
                variant="outline-secondary"
                onClick={handleOnClickUp}
                disabled={i >= code.codes.length - 1}
              >
                <BsFillCaretRightFill />
              </Button>
            </InputGroup>
          </Col>
          <Col>
            {bytelen(code.codes[i] || "")} {t("luaCode.characters")}
          </Col>
          {code.overrun ? (
            <Col xs="auto">
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    <>
                      {t("luaCode.overrun")}
                      {code.samecolordiv ? (
                        <>
                          <br />
                          {t("luaCode.colorSplit")}
                        </>
                      ) : (
                        false
                      )}
                    </>
                  </Tooltip>
                }
              >
                <div>
                  <BsFillExclamationTriangleFill className="fs-4 text-warning" />
                </div>
              </OverlayTrigger>
            </Col>
          ) : (
            false
          )}
          <Col xs="auto" className="justify-content-end">
            <Button variant="outline-primary" onClick={handleDownloadClick}>
              <BsDownload />
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body
        as="textarea"
        rows={12}
        className="font-monospace p-1"
        value={code.codes[i] || ""}
        readOnly={true}
      />
    </Card>
  );
};

function bytelen(s: string) {
  return new Blob([s]).size;
}

export default LuaCode;

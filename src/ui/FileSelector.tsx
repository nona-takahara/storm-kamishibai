import React, { useCallback, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Spinner,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { BsDashCircle, BsPlusCircle } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export type FileSelectorProps = {
  onFileChange: (file: File) => void;
  imageUrl: string;
  width: number;
  height: number;
  loading: boolean;
};

const FileSelector: React.FC<FileSelectorProps> = ({
  onFileChange,
  imageUrl,
  width,
  height,
  loading,
}) => {
  const { t } = useTranslation();
  const [scale, setScale] = useState(0);
  const scaleMax = 3;
  const scaleMin = -2;

  const handleFileChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target.files?.[0];
    if (target && target.type.match("image.*")) {
      onFileChange(target);
    }
  }, [onFileChange]);

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>{t("fileSelector.title")}</Col>
          <Col xs="auto" className="justify-content-end">
            <InputGroup>
              <Button
                variant="outline-secondary"
                onClick={() => setScale((s) => Math.max(s - 1, scaleMin))}
                disabled={scale <= scaleMin}
              >
                <BsDashCircle />
              </Button>
              <InputGroup.Text>{Math.pow(2, scale) * 100} %</InputGroup.Text>
              <Button
                variant="outline-secondary"
                onClick={() => setScale((s) => Math.min(s + 1, scaleMax))}
                disabled={scale >= scaleMax}
              >
                <BsPlusCircle />
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Stack gap={2}>
          <Form.Group controlId="formFile">
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
          <OverlayTrigger
            overlay={
              <Tooltip>
                {t("fileSelector.tooltipSize", { width: width, height: height })}
              </Tooltip>
            }
          >
            <div style={{ overflow: "auto", maxHeight: window.innerHeight / 3 }}>
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">{t("fileSelector.loading")}</span>
                </Spinner>
              ) : (
                <img
                  src={imageUrl}
                  alt=""
                  style={{
                    height: height * Math.pow(2, scale),
                    width: width * Math.pow(2, scale),
                    imageRendering: "pixelated",
                  }}
                />
              )}
            </div>
          </OverlayTrigger>
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default FileSelector;

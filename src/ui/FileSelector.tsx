import React from 'react';
import { Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Spinner, Stack, Tooltip } from 'react-bootstrap';
import { BsDashCircle, BsPlusCircle } from 'react-icons/bs';
import { withTranslation, type WithTranslation } from 'react-i18next';

export type FileSelectorProps = {
  onFileChange: (file: File) => void;
  imageUrl: string;
  width: number;
  height: number;
  loading: boolean;
} & WithTranslation;

export type FileSelectorState = {
  scale: number;
};

class FileSelector extends React.Component<FileSelectorProps, FileSelectorState> {
  constructor(props: FileSelectorProps) {
    super(props);
    this.state = { scale: 0 };
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const target = evt.target.files?.[0];
    if (target && target.type.match('image.*')) {
      this.props.onFileChange(target);
    }
  }

  render(): React.ReactNode {
    const { t } = this.props;
    const scaleMax = 3;
    const scaleMin = -2;
    return (
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>{t('fileSelector.title')}</Col>
            <Col xs="auto" className="justify-content-end">
              <InputGroup>
                <Button
                  variant="outline-secondary"
                  onClick={() => this.setState((state) => ({ ...state, scale: Math.max(state.scale - 1, scaleMin) }))}
                  disabled={this.state.scale <= scaleMin}
                >
                  <BsDashCircle />
                </Button>
                <InputGroup.Text>{Math.pow(2, this.state.scale) * 100} %</InputGroup.Text>
                <Button
                  variant="outline-secondary"
                  onClick={() => this.setState((state) => ({ ...state, scale: Math.min(state.scale + 1, scaleMax) }))}
                  disabled={this.state.scale >= scaleMax}
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
              <Form.Control type="file" accept="image/*" onChange={this.handleFileChange} />
            </Form.Group>
            <OverlayTrigger overlay={<Tooltip>{t('fileSelector.tooltipSize', { width: this.props.width, height: this.props.height })}</Tooltip>}>
              <div style={{ overflow: 'auto', maxHeight: window.innerHeight / 3 }}>
                {this.props.loading ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('fileSelector.loading')}</span>
                  </Spinner>
                ) : (
                  <img
                    src={this.props.imageUrl}
                    alt=""
                    style={{
                      height: this.props.height * Math.pow(2, this.state.scale),
                      width: this.props.width * Math.pow(2, this.state.scale),
                      imageRendering: 'pixelated',
                    }}
                  />
                )}
              </div>
            </OverlayTrigger>
          </Stack>
        </Card.Body>
      </Card>
    );
  }
}

const TranslatedFileSelector = withTranslation()(FileSelector);
export default TranslatedFileSelector;


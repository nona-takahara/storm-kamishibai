import React from 'react';
import { Card, Form, OverlayTrigger, Spinner, Stack, Tooltip } from 'react-bootstrap';

export type FileSelectorProps = {
  onFileChange: Function;
  imageUrl: string;
  width: number;
  height: number;
  loading: boolean;
}

export type FileSelectorState = {
  scale: number;
}

export default class FileSelector extends React.Component<FileSelectorProps, FileSelectorState> {
  constructor(props: FileSelectorProps) {
    super(props);
    this.state = { scale: 1 };
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const target = evt.target.files![0];
    if (target !== null && target.type.match('image.*')) {
      this.props.onFileChange(target);
    }
  }

  render(): React.ReactNode {
    return (
      <Card>
        <Card.Body>
          <Stack gap={2}>
            <Form.Group controlId='formFile'>
              <Form.Control type='file' accept='image/*' onChange={this.handleFileChange} />
            </Form.Group>
            
            <div style={{ overflow: 'auto' }}>
            <OverlayTrigger overlay={<Tooltip>幅{this.props.width}&#xd7;高さ{this.props.height}</Tooltip>}>
                {this.props.loading ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>)
                  :
                  (
                  <img src={this.props.imageUrl}
                    style={{ height: this.props.height * this.state.scale, width: this.props.width * this.state.scale, imageRendering: 'pixelated' }} />)}
            </OverlayTrigger>
            
            </div>
          </Stack>
        </Card.Body>
      </Card>
    );
  }
}


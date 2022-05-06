import React from 'react';
import { Card, Form, OverlayTrigger, Stack, Tooltip } from 'react-bootstrap';
import { fileReadAsDataURL, imageLoad, u8ImageDataLoad } from '../PictureFileReader';

export type FileSelectorProps = {
  onFileChange: Function;
}

export type FileSelectorState = {
  loadingPhase: number;
  loadingPhaseMax: number; // <-このネーミングが悪い
  image: string;
  width: number;
  height: number;
  scale: number;
}

export default class FileSelector extends React.Component<FileSelectorProps, FileSelectorState> {
  constructor(props: FileSelectorProps) {
    super(props);
    this.state = { loadingPhase: 0, loadingPhaseMax: 0, image: '', width: 0, height: 0, scale: 1 };
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(evt: React.ChangeEvent<HTMLInputElement>) {
    // 今は暫定的にファイルは1択としているが、今後の余力次第で柔軟に変更可能にする
    const target = evt.target.files![0];
    if (target !== null) {
      this.setState({ loadingPhase: 0, loadingPhaseMax: 3 });
      fileReadAsDataURL(target).then((result) => {
        this.setState((prev) => ({ loadingPhase: prev.loadingPhase + 1, image: result }));
        return imageLoad(result);
      }).then((result) => {
        this.setState((prev) => ({ loadingPhase: prev.loadingPhase + 1, height: result.naturalHeight, width: result.naturalWidth }));
        return u8ImageDataLoad(true, result);
      }).then((result) => {
        this.setState((prev) => ({ loadingPhase: prev.loadingPhase + 1 }));
        this.props.onFileChange(result);
      }).catch((reason) => {
      });
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
            <progress
              value={this.state.loadingPhase}
              max={this.state.loadingPhaseMax} />
            <OverlayTrigger overlay={<Tooltip>幅{this.state.width}&#xd7;高さ{this.state.height}</Tooltip>}>
              <div style={{overflow : 'auto'}}>
                <img src={this.state.image}
                style={{ height: this.state.height * this.state.scale, width: this.state.width * this.state.scale, imageRendering: 'pixelated' }} />
              </div>
            </OverlayTrigger>
          </Stack>
        </Card.Body>
      </Card>
    );
  }
}


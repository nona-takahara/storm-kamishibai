import { Card, Stack, Button, Row, Col } from "react-bootstrap";

type ConvertBoxProps = {
  isVisible: boolean;
  isWorking: boolean;
  needReconvert: boolean;
  onStartConvertClick: React.MouseEventHandler<HTMLButtonElement>;
  onStopConvertClick: React.MouseEventHandler<HTMLButtonElement>;
  onApplyClick: React.MouseEventHandler<HTMLButtonElement>;
  convertProgress: number;
}

export default function ConvertBox(props: ConvertBoxProps) {
  const progress = (props.isWorking || !props.needReconvert) ? props.convertProgress : 0;
  const canReapply = (!props.needReconvert) && progress === 1;
  return props.isVisible && (
    <Card>
      <Card.Body>
        <Stack gap={2}>
          <Row>
            <Col xs={6} className="d-grid">
              {(!props.isWorking)
                ? <Button onClick={props.onStartConvertClick} variant={(!props.needReconvert ? 'outline-' : '') + 'primary'} disabled={!props.needReconvert}>解析開始</Button>
                : <Button onClick={props.onStopConvertClick} variant='danger'>解析停止</Button>
              }
            </Col>
            <Col xs={6} className="d-grid">
              <Button onClick={props.onApplyClick} variant={(!canReapply ? 'outline-' : '') + 'success'} disabled={!canReapply}>設定適用</Button>
            </Col>
          </Row>
          <progress value={progress} max={1} />
          <div>{props.needReconvert ? ('解析が必要です') : '解析 ' + (Math.floor((progress * 1000) / 10).toString()) + '% 完了'} </div>
        </Stack>
      </Card.Body>
    </Card>
  ) || <></>;
}

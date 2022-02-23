import { Card, Stack, Button } from "react-bootstrap";

type ConvertBoxProps = {
  isWorking: boolean;
  disableStartButton: boolean;
  onStartConvertClick: React.MouseEventHandler<HTMLButtonElement>;
  onStopConvertClick: React.MouseEventHandler<HTMLButtonElement>;
  convertProgress: number;
}

export default function ConvertBox(props: ConvertBoxProps) {
  let progress = (props.isWorking || props.convertProgress === 1) ? props.convertProgress : 0;
  return (
    <Card>
      <Card.Body>
        <Stack gap={2}>
          {(!props.isWorking)
            ? <Button onClick={props.onStartConvertClick} variant='primary' disabled={props.disableStartButton}>変換開始</Button>
            : <Button onClick={props.onStopConvertClick} variant='danger'>変換停止</Button>
          }
          <progress value={progress} max={1} />
          <div>{Math.floor(progress * 1000) / 10} %</div>
        </Stack>
      </Card.Body>
    </Card>
  );
}

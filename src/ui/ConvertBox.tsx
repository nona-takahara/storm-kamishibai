import { Button, Card, Col, Row, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

type ConvertBoxProps = {
  isVisible: boolean;
  isWorking: boolean;
  needReconvert: boolean;
  onStartConvertClick: React.MouseEventHandler<HTMLButtonElement>;
  onStopConvertClick: React.MouseEventHandler<HTMLButtonElement>;
  onApplyClick: React.MouseEventHandler<HTMLButtonElement>;
  convertProgress: number;
};

export default function ConvertBox(props: ConvertBoxProps) {
  const { t } = useTranslation();
  const progress = props.isWorking || !props.needReconvert ? props.convertProgress : 0;
  const canReapply = !props.needReconvert && progress === 1;
  const progressPercent = Math.floor((progress * 1000) / 10).toString();

  return (
    (props.isVisible && (
      <Card>
        <Card.Body>
          <Stack gap={2}>
            <Row>
              <Col xs={6} className="d-grid">
                {!props.isWorking ? (
                  <Button
                    onClick={props.onStartConvertClick}
                    variant={`${!props.needReconvert ? 'outline-' : ''}primary`}
                    disabled={!props.needReconvert}
                  >
                    {t('convert.start')}
                  </Button>
                ) : (
                  <Button onClick={props.onStopConvertClick} variant="danger">
                    {t('convert.stop')}
                  </Button>
                )}
              </Col>
              <Col xs={6} className="d-grid">
                <Button
                  onClick={props.onApplyClick}
                  variant={`${!canReapply ? 'outline-' : ''}success`}
                  disabled={!canReapply}
                >
                  {t('convert.apply')}
                </Button>
              </Col>
            </Row>
            <progress value={progress} max={1} />
            <div>
              {props.needReconvert && !props.isWorking
                ? t('convert.needsAnalyze')
                : t('convert.progressDone', { percent: progressPercent })}{' '}
            </div>
          </Stack>
        </Card.Body>
      </Card>
    )) || <></>
  );
}

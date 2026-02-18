import React from 'react';
import { Alert, ButtonGroup, Card, Col, Form, FormControl, InputGroup, Row, Stack, ToggleButton } from 'react-bootstrap';
import { BsArrowDownSquareFill, BsArrowLeftSquareFill, BsArrowRightSquareFill, BsArrowUpSquareFill, BsExclamationCircle } from 'react-icons/bs';
import { withTranslation, type WithTranslation } from 'react-i18next';
import type ConvertOption from '../ConvertOption';
import type LuaCodeOption from '../LuaCodeOption';
import LabeledInput from './util/LabeledInput';

export type BasicSettingTabProps = {
  changeLuaCodeSettings: (v: Partial<LuaCodeOption>, needReconvert?: boolean) => void;
  convertOption: ConvertOption;
  luaCodeOption: LuaCodeOption;
} & WithTranslation;

class BasicSettingTab extends React.Component<BasicSettingTabProps> {
  render() {
    const { t } = this.props;
    return (
      <Stack gap={2}>
        <Card>
          <Card.Body>
            <Stack gap={2}>
              <Form.Check type="checkbox">
                <Form.Check.Input
                  type="checkbox"
                  id="rollsign"
                  defaultChecked={this.props.luaCodeOption.isRollSign}
                  onChange={(evt) => this.props.changeLuaCodeSettings({ isRollSign: evt.target.checked })}
                />
                <Form.Check.Label htmlFor="rollsign">{t('basic.rollsignMode')}</Form.Check.Label>
              </Form.Check>
              <Card.Text>
                {t('basic.rollsignBefore')}
                <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2850204940" target="_blank" rel="noopener noreferrer">
                  Analog Destination Indicator (Rollsign)
                </a>
                {t('basic.rollsignAfter')}
              </Card.Text>
              <Form.Group as={Row}>
                <Form.Label column xs={3}>{t('basic.gap')}</Form.Label>
                <Col>
                  <FormControl
                    type="number"
                    defaultValue={this.props.luaCodeOption.luaRollSignGap}
                    disabled={!this.props.luaCodeOption.isRollSign}
                    onChange={(evt) => this.props.changeLuaCodeSettings({ luaRollSignGap: Number(evt.target.value) })}
                  />
                </Col>
              </Form.Group>
              {this.props.luaCodeOption.isRollSign &&
              this.props.convertOption.luaCardHeight + this.props.luaCodeOption.luaRollSignGap !== 32 ? (
                <Alert variant="warning" className="mb-0">
                  <Row>
                    <Col xs="auto" className="pe-0">
                      <BsExclamationCircle />
                    </Col>
                    <Col>{t('basic.warning32')}</Col>
                  </Row>
                </Alert>
              ) : (
                <></>
              )}
            </Stack>
          </Card.Body>
        </Card>
        <Form.Group as={Row}>
          <Form.Label column xs={4}>{t('basic.startIndex')}</Form.Label>
          <Col>
            <Form.Control
              type="number"
              defaultValue={this.props.luaCodeOption.luaCardIndexStartWith}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => this.props.changeLuaCodeSettings({ luaCardIndexStartWith: Number(evt.target.value) })}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column xs={4}>{t('basic.readChannel')}</Form.Label>
          <Col>
            <Form.Control
              type="number"
              defaultValue={this.props.luaCodeOption.luaReadChannel}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => this.props.changeLuaCodeSettings({ luaReadChannel: Number(evt.target.value) })}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column xs={4}>
            {t('basic.maxCharactersPerBlock')}
          </Form.Label>
          <Col>
            <Form.Control
              type="number"
              defaultValue={this.props.luaCodeOption.luaMaxLength}
              onChange={(evt) => this.props.changeLuaCodeSettings({ luaMaxLength: Number(evt.target.value) })}
            />
          </Col>
        </Form.Group>
        <Row>
          <Form.Label column xs={2}>
            {t('basic.offset')}
          </Form.Label>
          <InputGroup as={Col}>
            <LabeledInput
              label={t('main.x')}
              type="number"
              defaultValue={this.props.luaCodeOption.luaOffsetX}
              onChange={(evt) => this.props.changeLuaCodeSettings({ luaOffsetX: Number(evt.target.value) })}
            />
            <LabeledInput
              label={t('main.y')}
              type="number"
              defaultValue={this.props.luaCodeOption.luaOffsetY}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => this.props.changeLuaCodeSettings({ luaOffsetY: Number(evt.target.value) })}
            />
          </InputGroup>
        </Row>
        <Row>
          <Form.Label column xs={2}>{t('basic.scale')}</Form.Label>
          <InputGroup as={Col}>
            <LabeledInput
              label={t('main.horizonal')}
              type="number"
              defaultValue={this.props.luaCodeOption.luaScaleH}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => this.props.changeLuaCodeSettings({ luaScaleH: Number(evt.target.value) })}
            />
            <LabeledInput
              label={t('main.vectral')}
              type="number"
              defaultValue={this.props.luaCodeOption.luaScaleV}
              disabled={this.props.luaCodeOption.isRollSign}
              onChange={(evt) => this.props.changeLuaCodeSettings({ luaScaleV: Number(evt.target.value) })}
            />
          </InputGroup>
        </Row>
        <Row>
          <Col xs={2}>{t('basic.rotate')}</Col>
          <Col className="d-grid">
            <ButtonGroup>
              {[
                { name: <BsArrowLeftSquareFill />, value: 90 },
                { name: <BsArrowUpSquareFill />, value: 0 },
                { name: <BsArrowRightSquareFill />, value: 270 },
                { name: <BsArrowDownSquareFill />, value: 180 },
              ].map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant="outline-secondary"
                  name="radio"
                  className="fs-5"
                  disabled={this.props.luaCodeOption.isRollSign}
                  value={radio.value}
                  checked={this.props.luaCodeOption.luaRotate === radio.value}
                  onChange={(evt) => this.props.changeLuaCodeSettings({ luaRotate: Number(evt.target.value) })}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>
        </Row>
      </Stack>
    );
  }
}

const TranslatedBasicSettingTab = withTranslation()(BasicSettingTab);
export default TranslatedBasicSettingTab;

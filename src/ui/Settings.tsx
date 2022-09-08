import React from 'react';
import { Container, Navbar, Row, Col, Stack, Nav, Tabs, Tab, Card } from 'react-bootstrap';

import BasicSettingTab, { BasicSettingTabProps } from "./BasicSettingTab";
import MainSettingTab, { MainSettingTabProps } from "./MainSettingTab";

type SettingsProps = {
  isVisible: boolean;
  main: MainSettingTabProps;
}

export default function ConvertBox(props: SettingsProps) {
  return props.isVisible && (
    <Tab.Container defaultActiveKey="reconvsetting">
      <Card>
        <Card.Header>
          <Nav variant="tabs" >
            <Nav.Item>
              <Nav.Link eventKey="reconvsetting">変換オプション</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="mainsetting">描画オプション</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
      <Card.Body>
      <Tab.Content>
      <Tab.Pane eventKey="reconvsetting">
        <MainSettingTab
          changeSettings={props.main.changeSettings}
          luaCodeOption={props.main.luaCodeOption}
          colorSet={props.main.colorSet}
          colorOrder={props.main.colorOrder}
          undrawFlag={props.main.undrawFlag}
          onDrawFlagChange={props.main.onDrawFlagChange}
          onMoveUpClick={props.main.onMoveUpClick}
          onMoveDownClick={props.main.onMoveDownClick}
          onColorChange={props.main.onColorChange}
        />
      </Tab.Pane>
      <Tab.Pane eventKey="mainsetting">
        <BasicSettingTab
          changeSettings={props.main.changeSettings}
          luaCodeOption={props.main.luaCodeOption}
        />
      </Tab.Pane>
      </Tab.Content>
      </Card.Body>
      </Card>
    </Tab.Container>) || <></>;
}
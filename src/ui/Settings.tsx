import { Nav, Tab, Card } from 'react-bootstrap';

import BasicSettingTab from "./BasicSettingTab";
import MainSettingTab, { MainSettingTabProps } from "./MainSettingTab";

type SettingsProps = {
  isVisible: boolean;
  main: MainSettingTabProps;
}

export default function ConvertBox(props: SettingsProps) {
  return (props.isVisible && (
    <Tab.Container defaultActiveKey="reconvsetting">
      <Card>
        <Card.Header>
          <Nav variant="tabs" >
            <Nav.Item>
              <Nav.Link eventKey="reconvsetting">解析オプション</Nav.Link>
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
          changeConvertSettings={props.main.changeConvertSettings}
          changeLuaCodeSettings={props.main.changeLuaCodeSettings}
          luaCodeOption={props.main.luaCodeOption}
          convertOption={props.main.convertOption}
          colorSet={props.main.colorSet}
          colorOrder={props.main.colorOrder}
          transparentStartOrder={props.main.transparentStartOrder}
          onDrawFlagChange={props.main.onDrawFlagChange}
          onMoveUpClick={props.main.onMoveUpClick}
          onMoveDownClick={props.main.onMoveDownClick}
          onColorChange={props.main.onColorChange}
        />
      </Tab.Pane>
      <Tab.Pane eventKey="mainsetting">
        <BasicSettingTab
          changeLuaCodeSettings={props.main.changeLuaCodeSettings}
          luaCodeOption={props.main.luaCodeOption}
          convertOption={props.main.convertOption}
        />
      </Tab.Pane>
      </Tab.Content>
      </Card.Body>
      </Card>
    </Tab.Container>)) || <></>;
}
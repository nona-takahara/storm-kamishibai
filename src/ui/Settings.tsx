import { Nav, Tab, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import BasicSettingTab from "./BasicSettingTab";
import MainSettingTab from "./MainSettingTab";
import type { MainSettingTabProps } from "./MainSettingTab";

type SettingsProps = {
  isVisible: boolean;
  main: MainSettingTabProps;
};

export default function ConvertBox(props: SettingsProps) {
  const { t } = useTranslation();
  return (
    (props.isVisible && (
      <Tab.Container defaultActiveKey="reconvsetting">
        <Card>
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="reconvsetting">
                  {t("settings.reconvTab")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="mainsetting">
                  {t("settings.mainTab")}
                </Nav.Link>
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
      </Tab.Container>
    )) || <></>
  );
}

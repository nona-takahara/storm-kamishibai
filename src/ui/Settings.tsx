import React from 'react';
import { Container, Navbar, Row, Col, Stack, Nav } from 'react-bootstrap';

import SettingTab, { SettingTabProps } from "./SettingTab";
import ColorList, { ColorListProps } from "./ColorList";

type SettingsProps = {
  isVisible: boolean;
  tab: SettingTabProps;
  colorList: ColorListProps;
}

export default function ConvertBox(props: SettingsProps) {
  return props.isVisible && (
  <Stack gap={2}>
    <SettingTab
      changeSettings={props.tab.changeSettings}
      luaCodeOption={props.tab.luaCodeOption}
    />
    <ColorList
      colorSet={props.colorList.colorSet}
      colorOrder={props.colorList.colorOrder}
      undrawFlag={props.colorList.undrawFlag}
      onDrawFlagChange={props.colorList.onDrawFlagChange}
      onMoveUpClick={props.colorList.onMoveUpClick}
      onMoveDownClick={props.colorList.onMoveDownClick}
      onColorChange={props.colorList.onColorChange}
  />
</Stack>) || <></>;
}
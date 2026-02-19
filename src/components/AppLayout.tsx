import React from "react";
import { Container, Navbar, Row, Col, Stack, Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FileSelector from "../ui/FileSelector";
import LuaCode from "../ui/LuaCode";
import ConvertBox from "../ui/ConvertBox";
import Settings from "../ui/Settings";
import HelpModal from "../ui/HelpModal";
import AboutModal from "../ui/AboutModal";
import LandingBox from "../ui/LandingBox";
import ConvertOption from "../ConvertOption";
import LuaCodeOption from "../LuaCodeOption";

interface AppLayoutProps {
  handleFileChange: (file: File) => void;
  handleStartConvertClick: () => void;
  handleStopConvertClick: () => void;
  handleApplySettingsClick: () => void;
  handleChangeConvertSettings: (opt: ConvertOption, need?: boolean) => void;
  handleChangeLuaCodeSettings: (opt: LuaCodeOption) => void;
  handleOnDrawChange: (colorIndex: number, drawFlag: boolean) => void;
  handleOnMoveUpClick: (colorIndex: number) => void;
  handleOnMoveDownClick: (colorIndex: number) => void;
  handleOnColorChange: (colorIndex: number, colorInput: string) => void;
  handleModalClose: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  handleFileChange,
  handleStartConvertClick,
  handleStopConvertClick,
  handleApplySettingsClick,
  handleChangeConvertSettings,
  handleChangeLuaCodeSettings,
  handleOnDrawChange,
  handleOnMoveUpClick,
  handleOnMoveDownClick,
  handleOnColorChange,
  handleModalClose,
}) => {
  const { t } = useTranslation();
  const {
    imageUrl,
    imageWidth,
    imageHeight,
    imageLoading,
    isWorking,
    needReconvert,
    convertProgress,
    generatedCode,
    luaCodeOption,
    convertOption,
    colorSet,
    orderTable,
    transparentStartOrder,
    modalShow,
    setModalShow,
  } = useAppStore();

  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="light">
        <Container className="px-5" fluid="xl">
          <Navbar.Brand>Storm Kamishibai</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Link
                href="https://forms.gle/TRxMsVQLBrCc3yJF7"
                target="_blank"
              >
                {t("app.contact")}
              </Nav.Link>
              <Nav.Link onClick={() => setModalShow("help")}>
                {t("app.help")}
              </Nav.Link>
              <Nav.Link onClick={() => setModalShow("about")}>
                {t("app.about")}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="px-5 mb-4" fluid="xl">
        <Row>
          <Col md={4} lg={6} className="mt-4">
            <Stack gap={2}>
              <FileSelector
                onFileChange={handleFileChange}
                imageUrl={imageUrl}
                width={imageWidth}
                height={imageHeight}
                loading={imageLoading}
              />
              <ConvertBox
                isVisible={imageUrl !== ""}
                isWorking={isWorking}
                onStartConvertClick={handleStartConvertClick}
                onStopConvertClick={handleStopConvertClick}
                onApplyClick={handleApplySettingsClick}
                needReconvert={needReconvert}
                convertProgress={convertProgress}
              />
              <LuaCode isVisible={imageUrl !== ""} code={generatedCode} />
            </Stack>
          </Col>
          <Col md={8} lg={6} className="mt-4">
            <LandingBox isVisible={imageUrl === ""} />
            <Settings
              isVisible={imageUrl !== ""}
              main={{
                changeConvertSettings: handleChangeConvertSettings,
                changeLuaCodeSettings: handleChangeLuaCodeSettings,
                luaCodeOption: luaCodeOption,
                convertOption: convertOption,
                colorSet: colorSet,
                colorOrder: orderTable,
                transparentStartOrder: transparentStartOrder,
                onDrawFlagChange: handleOnDrawChange,
                onMoveUpClick: handleOnMoveUpClick,
                onMoveDownClick: handleOnMoveDownClick,
                onColorChange: handleOnColorChange,
              }}
            />
          </Col>
        </Row>
      </Container>
      <HelpModal show={modalShow === "help"} onClose={handleModalClose} />
      <AboutModal show={modalShow === "about"} onClose={handleModalClose} />
    </>
  );
};

export default AppLayout;

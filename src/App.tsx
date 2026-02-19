/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "./store/AppStore";
import { useWorker } from "./hooks/useWorker";
import { useFileHandler } from "./hooks/useFileHandler";
import { useConvert } from "./hooks/useConvert";
import { useSettings } from "./hooks/useSettings";
import { useColorManagement } from "./hooks/useColorManagement";
import AppLayout from "./components/AppLayout";
import Color from "./Color";
import FinalizeLuaCode from "./gencode/FinalizeLuaCode";

const App: React.FC = () => {
  const { t } = useTranslation();

  const { postMessageToMain } = useWorker();
  const { handleFileChange } = useFileHandler(postMessageToMain);
  const { handleStartConvertClick, handleStopConvertClick, luaCodesRef } = useConvert(postMessageToMain);
  const { handleChangeConvertSettings, handleChangeLuaCodeSettings } = useSettings();
  const {
    handleOnDrawChange,
    handleOnMoveUpClick,
    handleOnMoveDownClick,
    handleOnColorChange,
  } = useColorManagement();

  const { setGeneratedCode, colorSetRef, orderTableRef, convertOptionRef, luaCodeOptionRef } = useAppStore();

  const handleApplySettingsClick = useCallback(() => {
    const u = new Array<Color>(orderTableRef.current.length);
    for (let i = 0; i < orderTableRef.current.length; i++) {
      u[orderTableRef.current[i]] = colorSetRef.current[i];
    }
    const final = FinalizeLuaCode(
      luaCodesRef.current || [],
      u,
      convertOptionRef.current,
      luaCodeOptionRef.current,
    );
    setGeneratedCode(final);
  }, [setGeneratedCode, colorSetRef, orderTableRef, luaCodesRef, convertOptionRef, luaCodeOptionRef]);

  const { setModalShow } = useAppStore();

  const handleModalClose = useCallback(() => {
    setModalShow("");
  }, [setModalShow]);

  return (
    <AppLayout
      handleFileChange={handleFileChange}
      handleStartConvertClick={handleStartConvertClick}
      handleStopConvertClick={handleStopConvertClick}
      handleApplySettingsClick={handleApplySettingsClick}
      handleChangeConvertSettings={handleChangeConvertSettings}
      handleChangeLuaCodeSettings={handleChangeLuaCodeSettings}
      handleOnDrawChange={handleOnDrawChange}
      handleOnMoveUpClick={handleOnMoveUpClick}
      handleOnMoveDownClick={handleOnMoveDownClick}
      handleOnColorChange={handleOnColorChange}
      handleModalClose={handleModalClose}
    />
  );
};

export default App;

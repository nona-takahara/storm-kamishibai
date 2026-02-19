import { useCallback, useRef } from "react";
import StartConvertCommand from "../worker/StartConvertCommand";
import TerminateConverterCommand from "../worker/TerminateConverterCommand";
import { useAppStore } from "../store/AppStore";

export const useConvert = (postMessageToMain: (command: any, transfer?: Transferable[]) => void) => {
  const luaCodesRef = useRef<string[][] | undefined>(undefined);

  const {
    setIsWorking,
    needReconvertRef,
    orderTableRef,
    colorSetRef,
    convertOptionRef,
    transparentStartOrderRef,
  } = useAppStore();

  const handleStartConvertClick = useCallback(() => {
    if (needReconvertRef.current) {
      const u = new Uint32Array(orderTableRef.current.length);
      for (let i = 0; i < orderTableRef.current.length; i++) {
        u[orderTableRef.current[i]] = colorSetRef.current[i].raw || 0;
      }

      const cmd = new StartConvertCommand(
        convertOptionRef.current,
        u,
        transparentStartOrderRef.current,
      );
      postMessageToMain(cmd, cmd.getTransfer());
      setIsWorking(true);
      luaCodesRef.current = [];
    }
  }, [postMessageToMain, setIsWorking, needReconvertRef, orderTableRef, colorSetRef, convertOptionRef, transparentStartOrderRef]);

  const handleStopConvertClick = useCallback(() => {
    const cmd = new TerminateConverterCommand();
    postMessageToMain(cmd, cmd.getTransfer());
    setIsWorking(false);
  }, [postMessageToMain, setIsWorking]);

  return { handleStartConvertClick, handleStopConvertClick, luaCodesRef };
};
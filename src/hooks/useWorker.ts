import { useCallback, useEffect, useRef } from "react";
import { WorkerService } from "../services/WorkerService";
import WorkerCommand from "../worker/WorkerCommand";
import ConvertCardCommand from "../worker/ConvertCardCommand";
import TerminateConverterCommand from "../worker/TerminateConverterCommand";
import ConvertSucceedCommand from "../worker/ConvertSucceedCommand";
import FileLoadedCommand from "../worker/FileLoadedCommand";
import ConvertResultCommand from "../worker/ConvertResultCommand";
import EndConvertCommand from "../worker/EndConvertCommand";
import Color from "../Color";
import FinalizeLuaCode from "../gencode/FinalizeLuaCode";
import { useAppStore } from "../store/AppStore";

export const useWorker = () => {
  const workerServiceRef = useRef<WorkerService | undefined>(undefined);
  const luaCodesRef = useRef<string[][] | undefined>(undefined);

  const {
    setColorSet,
    setOrderTable,
    setImageLoading,
    setTransparentStartOrder,
    setNeedReconvert,
    setLuaCodes,
    setConvertProgress,
    setIsWorking,
    setGeneratedCode,
    colorSetRef,
    orderTableRef,
    transparentStartOrderRef,
    needReconvertRef,
    convertOptionRef,
    luaCodeOptionRef,
  } = useAppStore();

  const handleWorkerMessage = useCallback(
    (evt: MessageEvent<WorkerCommand>) => {
      const data = evt.data;
      if (ConvertCardCommand.is(data)) {
        workerServiceRef.current?.postMessageToSub(data, data.getTransfer());
      } else if (TerminateConverterCommand.is(data)) {
        workerServiceRef.current?.terminateSubWorker();
      } else if (ConvertSucceedCommand.is(data)) {
        const ndata = ConvertSucceedCommand.from(data);
        workerServiceRef.current?.postMessageToMain(ndata, ndata.getTransfer());
      } else if (FileLoadedCommand.is(data)) {
        const colorSetLocal = data.colorPallete.map(
          (v) =>
            new Color(
              v.originalR,
              v.originalG,
              v.originalB,
              v.originalA,
              v.raw,
            ),
        );
        const orderTableLocal = colorSetLocal.map((_, i) => i);

        setColorSet(colorSetLocal);
        setOrderTable(orderTableLocal);
        setImageLoading(false);
        setTransparentStartOrder(orderTableLocal.length);
        setNeedReconvert(true);
      } else if (ConvertResultCommand.is(data)) {
        const l = luaCodesRef.current ? luaCodesRef.current.slice() : [];
        l[data.metaData.offsetListIndex] = data.luaList;
        luaCodesRef.current = l;
        setConvertProgress(data.metaData.finished / data.metaData.length);
      } else if (EndConvertCommand.is(data)) {
        setIsWorking(false);
        setConvertProgress(1);
        setNeedReconvert(false);
        // apply settings using latest refs
        const final = FinalizeLuaCode(
          luaCodesRef.current || [],
          ((): Color[] => {
            const u = new Array<Color>(orderTableRef.current.length);
            for (let i = 0; i < orderTableRef.current.length; i++) {
              u[orderTableRef.current[i]] = colorSetRef.current[i];
            }
            return u;
          })(),
          convertOptionRef.current,
          luaCodeOptionRef.current,
        );
        setGeneratedCode(final);
      }
    },
    [
      setColorSet,
      setOrderTable,
      setImageLoading,
      setTransparentStartOrder,
      setNeedReconvert,
      setConvertProgress,
      setIsWorking,
      setGeneratedCode,
      colorSetRef,
      orderTableRef,
      transparentStartOrderRef,
      convertOptionRef,
      luaCodeOptionRef,
    ],
  );

  useEffect(() => {
    workerServiceRef.current = new WorkerService(handleWorkerMessage);
    return () => {
      workerServiceRef.current?.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postMessageToMain = useCallback((command: any, transfer?: Transferable[]) => {
    workerServiceRef.current?.postMessageToMain(command, transfer);
  }, []);

  return { postMessageToMain, luaCodesRef };
};
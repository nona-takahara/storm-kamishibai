import WorkerCommand from "./WorkerCommand";
import LuaCodeOption, { getDefault } from "../LuaCodeOption";
import ConvertResultCommand from "./ConvertResultCommand";
import ConvertSucceedCommand from "./ConvertSucceedCommand";
import FileLoadedCommand from "./FileLoadedCommand";
import OpenFileCommand from "./OpenFileCommand";
import StartConvertCommand from "./StartConvertCommand";
import TerminateConverterCommand from "./TerminateConverterCommand";
import ConvertCardCommand from "./ConvertCardCommand";
import Color from "../Color";
import EndConvertCommand from "./EndConvertCommand";

export default {}

type ConvertProgress = {
  x: number;
  y: number;
};

type WorkerData = {
  subWorker: Worker | undefined;
  rdata: Uint32Array;
  width: number;
  height: number;
  palleteLength: number;
  nextConvertCommand: ConvertCardCommand | undefined;
  convCurrent: ConvertProgress | undefined;
  convRule: LuaCodeOption;
  convData: Uint32Array;
}

function defaultWorkerData(): WorkerData {
  return {
    subWorker: undefined,
    rdata: new Uint32Array(),
    width: 0,
    height: 0,
    palleteLength: 0,
    nextConvertCommand: undefined,
    convCurrent: undefined,
    convRule: getDefault(),
    convData: new Uint32Array()
  };
}

// eslint-disable-next-line
const ctx: any = self as any;
let workerData: WorkerData;

ctx.addEventListener('message', (evt: MessageEvent<WorkerCommand>) => {
  const data = evt.data;
  if (!workerData) {
    workerData = defaultWorkerData();
  }
  if (ctx.Worker) {
    if (!workerData.subWorker) {
      workerData.subWorker = new Worker(new URL('../gencode/GenCode.ts', import.meta.url));
      workerData.subWorker.addEventListener('message', (evt: MessageEvent<WorkerCommand>) => {
        const data = evt.data;
        commandFromSubWorker(data);

      });
    }
  }

  function commandFromSubWorker(data: WorkerCommand): boolean {
    if (ConvertSucceedCommand.is(data)) {
      const hasNext = convertCard();
      
      // 現時点ではこれで問題ないが、おそらくLuaコードの生成はWorkerで行うことになるので、
      // 準備しておく
      const cmd = ConvertResultCommand.from(data);
      postMessage(cmd, cmd.getTransfer());

      if (!hasNext) {
        // Resultコマンドで終了の旨を送信する
        const cmd = (new EndConvertCommand());
        postMessage(cmd, cmd.getTransfer());
      }
    } else {
      return false;
    }
    return true;
  }

  if (!commandFromSubWorker(data)) {
    if (OpenFileCommand.is(data)) {
      const rdata = new Uint32Array(data.u8Image.buffer); // uint32による生データ
      const cs32 = Uint32Array.from(new Set(rdata)).reverse(); // 基準パレット生成

      const colorSet: Color[] = [];
      const cs = new Uint8ClampedArray(cs32.buffer);
      for (let i = 0; i < cs.length; i += 4) {
        colorSet.push(new Color(cs[i], cs[i + 1], cs[i + 2], cs[i + 3], cs32[i / 4]));
      }

      const cmd = (new FileLoadedCommand(colorSet));
      postMessage(cmd, cmd.getTransfer());

      workerData.rdata = rdata; // 生データのみ保持する
      workerData.width = data.width; // 画像幅
      workerData.height = data.height; // 画像高さ

    } else if (StartConvertCommand.is(data)) {
      workerData.convCurrent = undefined;
      workerData.convRule = data.settings;
      // 生データと決定稿のパレット順序から、今回の処理するデータ形式を確定
      workerData.convData = workerData.rdata.map((v: any) => data.colorPallete.indexOf(v));
      workerData.palleteLength = data.colorPallete.length;

      // 最初のコンバートコマンドを作成して、送信１回目を実施する。
      workerData.nextConvertCommand = makeNextConvertData();
      if (!convertCard()) {
        // Resultコマンドで終了の旨を送信する
        const cmd = (new EndConvertCommand());
        postMessage(cmd, cmd.getTransfer());
      }
    } else if (TerminateConverterCommand.is(data)) {
      if (ctx.Worker) {
        workerData.subWorker?.terminate();
        workerData.subWorker = undefined;
      } else {
        postMessage(data, data.getTransfer());
      }
    }
  }
});

function convertCard(): boolean {
  const cmd = workerData.nextConvertCommand;
  if (!cmd) {
    return false;
  }

  if (ctx.Worker) {
    workerData.subWorker?.postMessage(cmd, cmd.getTransfer());
  } else {
    postMessage(cmd, cmd.getTransfer());
  }

  workerData.nextConvertCommand = makeNextConvertData();

  return true;
}

function makeNextConvertData() {
  if (workerData.convCurrent === undefined) {
    workerData.convCurrent = {
      x: workerData.convRule.pictureOffsetX,
      y: workerData.convRule.pictureOffsetY,
    }
  } else {
    workerData.convCurrent.y +=
      workerData.convRule.luaCardHeight + workerData.convRule.pictureSkipV;

    if (workerData.convCurrent.y + workerData.convRule.luaCardHeight >= workerData.height) {
      workerData.convCurrent.x += workerData.convRule.luaCardWidth + workerData.convRule.pictureSkipH;
      workerData.convCurrent.y = workerData.convRule.pictureOffsetY;
    }
  }

  if (workerData.convCurrent.x + workerData.convRule.luaCardWidth >= workerData.width) {
    return undefined;
  }

  const d = new Uint32Array(workerData.convRule.luaCardWidth * workerData.convRule.luaCardHeight);
  for (let x = 0; x < workerData.convRule.luaCardWidth; x++) {
    for (let y = 0; y < workerData.convRule.luaCardHeight; y++) {
      d[x + y * workerData.convRule.luaCardWidth] =
        workerData.convData[workerData.convCurrent.x + x +
        (workerData.convCurrent.y + y) * workerData.width];
    }
  }

  return new ConvertCardCommand(
    d,
    workerData.convRule.luaCardWidth,
    workerData.convRule.luaCardHeight,
    workerData.palleteLength,
    {});
}
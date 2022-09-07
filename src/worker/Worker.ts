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

export default undefined;

type WorkerData = {
  subWorker: Worker | undefined;
  rdata: Uint32Array;
  width: number;
  height: number;
  palleteLength: number;
  commandStartOffsetListX: number[];
  commandStartOffsetListY: number[];
  commandStartOffsetList: boolean[];
  nextConvertCommand: ConvertCardCommand | undefined;
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
    commandStartOffsetListX: [],
    commandStartOffsetListY: [],
    commandStartOffsetList: [],
    nextConvertCommand: undefined,
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

      if (!workerData.commandStartOffsetList[data.metaData.offsetListIndex]) {
        workerData.commandStartOffsetList[data.metaData.offsetListIndex] = true;

        const luaList = new Array<string>(data.rectangleList.length);
        const vcmp = workerData.convRule.luaVCompress, hcmp = workerData.convRule.luaHCompress;
        for (let j = 0; j < data.rectangleList.length; j++) {
          let s = '';
          const dd = data.rectangleList[j];
          for (let i = 0; i < dd.length; i += 4) {
            if (dd[i + 2] === 1 && vcmp) {
              s += `V(${dd[i]},${dd[i + 1]},${dd[i + 3]})`
            } else if (dd[i + 3] === 1 && hcmp) {
              s += `H(${dd[i]},${dd[i + 1]},${dd[i + 2]})`
            } else {
              s += `R(${dd[i]},${dd[i + 1]},${dd[i + 2]},${dd[i + 3]})`
            }
          }
          luaList[j] = s;
        }

        const cmd = new ConvertResultCommand(luaList, {
          offsetListIndex: data.metaData.offsetListIndex,
          finished: workerData.commandStartOffsetList.filter((v) => v).length,
          length: workerData.commandStartOffsetList.length
        });

        postMessage(cmd, cmd.getTransfer());
      }

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
      workerData.convRule = data.settings;
      // 生データと決定稿のパレット順序から、今回の処理するデータ形式を確定
      workerData.convData = workerData.rdata.map((v: any) => data.colorPallete.indexOf(v));
      workerData.palleteLength = data.colorPallete.length;

      // 必要な変換コマンドのスタート地点を全部ピックアップ
      workerData.commandStartOffsetListX = [];
      for (let i = workerData.convRule.pictureOffsetX;
        i <= (workerData.width - workerData.convRule.luaCardWidth);
        i += workerData.convRule.luaCardWidth + workerData.convRule.pictureSkipH) {
        workerData.commandStartOffsetListX.push(i);
      }

      workerData.commandStartOffsetListY = [];
      for (let i = workerData.convRule.pictureOffsetY;
        i <= (workerData.height - workerData.convRule.luaCardHeight);
        i += workerData.convRule.luaCardHeight + workerData.convRule.pictureSkipV) {
        workerData.commandStartOffsetListY.push(i);
      }

      workerData.commandStartOffsetList = new Array<boolean>(
        workerData.commandStartOffsetListX.length * workerData.commandStartOffsetListY.length
      ).map(() => false);

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
  let cx = 0, cy = 0, offsetListIndex = -1;
  for (let x = 0; x < workerData.commandStartOffsetListX.length; x++) {
    for (let y = 0; y < workerData.commandStartOffsetListY.length; y++) {
      if (!workerData.commandStartOffsetList[y + workerData.commandStartOffsetListY.length * x]) {
        offsetListIndex = y + workerData.commandStartOffsetListY.length * x;
        cx = workerData.commandStartOffsetListX[x];
        cy = workerData.commandStartOffsetListY[y];
        break;
      }
    }
  }

  if (offsetListIndex === -1) {
    return undefined;
  }

  const d = new Uint32Array(workerData.convRule.luaCardWidth * workerData.convRule.luaCardHeight);
  for (let x = 0; x < workerData.convRule.luaCardWidth; x++) {
    for (let y = 0; y < workerData.convRule.luaCardHeight; y++) {
      d[x + y * workerData.convRule.luaCardWidth] =
        workerData.convData[cx + x + (cy + y) * workerData.width];
    }
  }

  return new ConvertCardCommand(
    d,
    workerData.convRule.luaCardWidth,
    workerData.convRule.luaCardHeight,
    workerData.palleteLength,
    { offsetListIndex: offsetListIndex });
}
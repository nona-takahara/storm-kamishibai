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
      if (convertCard()) {
        const cmd = new ConvertResultCommand(data.rectangleList, data.metaData);
        ctx.postMessage(cmd, cmd.getTransfer());
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
      if (!convertCard()) {
        // Resultコマンドで終了の旨を送信する
        //const cmd = (new EndConvertCommand());
        //postMessage(cmd, cmd.getTransfer());
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
  // Nested Workerに対応かどうかによって.subWorkerの指すWorkerが変わる！
  //
  // 1. Apps -> Worker (start-convert)
  // 2. Worker -> SubWorker (convert-card*)
  // 3. SubWorker -> Worker (convert-succeed*)
  // 4. Worker -> Apps (convert-result)
  // 5. 2に戻る(実際は先にconvert-cardを発行し、続けてconvert-resultを処理・発行する)
  // 6. Worker -> Apps (convert-end)
  // !. Apps -> Worker (convert-terminate!)
  // 
  // *がついているコマンドは、単純に.subWorkerにコマンドを渡せばよい。
  // Appsはコマンド種別を見て、ただお隣に横流しするだけで終わる。
  // terminateコマンドは、Nested Worker対応ならば直接SubWorkerを止めるが、
  // 非対応ならAppsにterminateコマンドを送り付ける必要がある。
});

function convertCard(): boolean {
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
    return false;
  }

  const d = new Uint32Array(workerData.convRule.luaCardWidth * workerData.convRule.luaCardHeight);
  for (let x = 0; x < workerData.convRule.luaCardWidth; x++) {
    for (let y = 0; y < workerData.convRule.luaCardHeight; y++) {
      d[x + y * workerData.convRule.luaCardWidth] =
        workerData.rdata[workerData.convCurrent.x + x +
        (workerData.convCurrent.y + y) * workerData.width];
    }
  }

  const cmd = new ConvertCardCommand(
    d,
    workerData.convRule.luaCardWidth,
    workerData.convRule.luaCardHeight,
    workerData.palleteLength,
    {});
  console.log(cmd);
  if (ctx.Worker) {
    workerData.subWorker?.postMessage(cmd, cmd.getTransfer());
  } else {
    postMessage(cmd, cmd.getTransfer());
  }
  return true;
}
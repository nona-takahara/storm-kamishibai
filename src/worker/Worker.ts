import WorkerCommand from "./WorkerCommand";
import LuaCodeOption, { getDefault } from "../LuaCodeOption";
import ConvertResultCommand from "./ConvertResultCommand";
import ConvertSucceedCommand from "./ConvertSucceedCommand";
import EndConvertCommand from "./EndConvertCommand";
import FileLoadedCommand from "./FileLoadedCommand";
import OpenFileCommand from "./OpenFileCommand";
import StartConvertCommand from "./StartConvertCommand";
import TerminateConverterCommand from "./TerminateConverterCommand";

export default {}

type WorkerData = {
  subWorker: Worker | undefined;
  rdata: Uint32Array;
  width: number;
  height: number;
  convCurrent: number | undefined;
  convRule: LuaCodeOption;
  convData: Uint32Array;
}

// eslint-disable-next-line
const ctx: any = self as any;
let workerData: WorkerData;

ctx.addEventListener('message', (evt: MessageEvent<WorkerCommand>) => {
  const data = evt.data;
  if (!workerData) {
    workerData = {
      subWorker: undefined,
      rdata: new Uint32Array(),
      width: 0,
      height: 0,
      convCurrent: undefined,
      convRule: getDefault(),
      convData: new Uint32Array()
    }
  }
  if (ctx.Worker) {
    if (!workerData.subWorker) {
      workerData.subWorker = new Worker(new URL('../gencode/GenCode.ts', import.meta.url));
    }
  }

  console.log(data);

  if (OpenFileCommand.is(data)) {
    const rdata = new Uint32Array(data.u8Image.buffer); // uint32による生データ
    const cs32 = Uint32Array.from(new Set(rdata)).reverse(); // 基準パレット生成

    const cmd = (new FileLoadedCommand(cs32));
    postMessage(cmd, cmd.getTransfer());
    
    workerData.rdata = rdata; // 生データのみ保持する
    workerData.width = data.width; // 画像幅
    workerData.height = data.height; // 画像高さ

  } else if (StartConvertCommand.is(data)) {
    workerData.convCurrent = undefined;
    workerData.convRule = data.settings;
    // 生データと決定稿のパレット順序から、今回の処理するデータ形式を確定
    workerData.convData = workerData.rdata.map((v: any) => data.colorPallete.indexOf(v));
    if (!convertCard()) {
      const cmd = (new EndConvertCommand());
      postMessage(cmd, cmd.getTransfer());
    }

  } else if (ConvertSucceedCommand.is(data)) {
    if (convertCard()) {
      const cmd = new ConvertResultCommand(data.rectangleList, data.metaData);
      postMessage(cmd, cmd.getTransfer());
    } else {
      const cmd = new EndConvertCommand();
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
  return true;
  // 次の1枚を変換するコマンドを作成・発行
  // 新しいconvert-cardコマンドが発行できなかった時、falseを返す
}
import Color from "../Color";
import FileLoadedCommand from "./FileLoadedCommand";
import OpenFileCommand from "./OpenFileCommand";
import WorkerCommand from "./WorkerCommand";

export default {}

// eslint-disable-next-line
const ctx: any = self as any;
let workerData: any;

ctx.addEventListener('message', (evt: MessageEvent<WorkerCommand>) => {
  const data = evt.data;
  if (!workerData.subWorker) {
    if (ctx.Worker) {
      workerData.subWorker = new Worker(new URL('../gencode/GenCode.ts', import.meta.url));
    } else {
      workerData.subWorker = ctx;
    }
  }

  if (data instanceof OpenFileCommand) {
    const rdata = new Uint32Array(data.u8Image.buffer); // uint32による生データ
    const cs32 = Uint32Array.from(new Set(rdata)).reverse(); // 基準パレット生成

    const cmd = new FileLoadedCommand(cs32);
    cmd.post(ctx);

    workerData.rdata = rdata;

    // Appにはuint32のパレットデータのコピーのみ返却し、App側でUI処理を実施
    // Appからuint32のパレットデータを再度受け取り、インデックスで処理する

    // Worker <-> App：元画像の色
    // Appでのみ変換後にLuaで使う色を知っている状態にしてしまう
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

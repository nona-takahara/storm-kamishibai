import Color from "../Color";
import OpenFileCommand from "./OpenFileCommand";
import WorkerCommand from "./WorkerCommand";

export default {}

// eslint-disable-next-line
const ctx: Worker = self as any;
let workerData: any;

ctx.addEventListener('message', (evt: MessageEvent<WorkerCommand>) => {
  const data = evt.data;
  if (data instanceof OpenFileCommand) {
    const rdata = new Uint32Array(data.u8Image.buffer); // uint32による生データ
    const cs32 = Uint32Array.from(new Set(rdata)).reverse(); // デフォルトのパレット順序

    // Appにはuint32のパレットデータのコピーのみ返却し、App側でUI処理を実施
    // Appからuint32のパレットデータを再度受け取り、インデックスで処理する

    // Worker <-> App：元画像の色
    // Appでのみ変換先の色を知っている状態にしてしまう
  }
  
  // SafariくんがNested Workerに対応してくれないので、yieldっぽい感じで実装する
  // 1. Apps側から最初にパレット情報を送信する
  // 2. Apps側から今回の切り抜き範囲を送信し、パレット1枚分進める
  // 主導権を常にApps側に握らせ、progress barもAppsで管理させる
  // 代わりに、
});

import MainWorker from "../worker/Worker.ts?worker";
import GenCodeWorker from "../gencode/GenCode.ts?worker";
import WorkerCommand from "../worker/WorkerCommand";

export class WorkerService {
  private mainWorker: Worker | undefined;
  private subWorker: Worker | undefined;
  private onMessageCallback:
    | ((evt: MessageEvent<WorkerCommand>) => void)
    | undefined;

  constructor(onMessage: (evt: MessageEvent<WorkerCommand>) => void) {
    this.onMessageCallback = onMessage;
    this.restartMainWorker();
  }

  private restartMainWorker() {
    try {
      this.mainWorker?.terminate();
    } catch {
      /* empty */
    }
    const worker = new MainWorker();
    worker.onmessage = this.onMessageCallback!;
    this.mainWorker = worker;
  }

  getMainWorker(): Worker {
    return this.mainWorker || this.restartMainWorker();
  }

  postMessageToMain(command: unknown, transfer?: Transferable[]) {
    this.getMainWorker().postMessage(command, transfer || []);
  }

  terminateSubWorker() {
    this.subWorker?.terminate();
    this.subWorker = undefined;
  }

  startSubWorker() {
    if (!this.subWorker) {
      this.subWorker = new GenCodeWorker();
      this.subWorker.onmessage = this.onMessageCallback!;
    }
  }

  postMessageToSub(command: unknown, transfer?: Transferable[]) {
    this.startSubWorker();
    this.subWorker!.postMessage(command, transfer || []);
  }

  terminate() {
    try {
      this.mainWorker?.terminate();
    } catch {
      /* empty */
    }
    try {
      this.subWorker?.terminate();
    } catch {
      /* empty */
    }
  }
}

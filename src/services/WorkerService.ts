import MainWorker from "../worker/Worker.ts?worker";
import GenCodeWorker from "../gencode/GenCode.ts?worker";
import WorkerCommand from "../worker/WorkerCommand";
import ConvertCardCommand from "../worker/ConvertCardCommand";
import TerminateConverterCommand from "../worker/TerminateConverterCommand";
import ConvertSucceedCommand from "../worker/ConvertSucceedCommand";
import StartConvertCommand from "../worker/StartConvertCommand";
import OpenFileCommand from "../worker/OpenFileCommand";
import { fileToU8Image } from "../PictureFileReader";
import Color from "../Color";
import FileLoadedCommand from "../worker/FileLoadedCommand";
import ConvertResultCommand from "../worker/ConvertResultCommand";
import EndConvertCommand from "../worker/EndConvertCommand";

export class WorkerService {
  private mainWorker: Worker | undefined;
  private subWorker: Worker | undefined;
  private onMessageCallback: ((evt: MessageEvent<WorkerCommand>) => void) | undefined;

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

  postMessageToMain(command: any, transfer?: Transferable[]) {
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

  postMessageToSub(command: any, transfer?: Transferable[]) {
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
import IWorkerMessage from "../IWorkerMessage";

export default class FileLoadedCommand implements IWorkerMessage {
  constructor(
    public colorPallete: Uint32Array
  ) { }
  
  getTransfer() { return []; }
}
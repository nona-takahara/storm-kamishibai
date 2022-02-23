import Color from "../Color";
import IWorkerMessage from "../IWorkerMessage";
import PictureData from "../PictureData";

export default class ConvertCommands implements IWorkerMessage {
  readonly pictureData: Uint32Array;
  readonly colorSet: Array<Color>
  readonly orderTable: number[];
  readonly drawFlagTable: boolean[];
  readonly cropWidth: number;
  readonly cropHeight: number;
  readonly pictureWidth: number;
  readonly pictureHeight: number;


  constructor(pic: PictureData, orderTable: number[], drawFlagTable: boolean[], width: number, height: number) {
    this.pictureData = pic.data.slice();
    this.colorSet = pic.colorSet.slice();
    this.orderTable = orderTable.slice();
    this.drawFlagTable = drawFlagTable.slice();
    this.cropWidth = width;
    this.cropHeight = height;
    this.pictureWidth = pic.width;
    this.pictureHeight = pic.height;
  }

  getTransfer(): Transferable[] {
      return [this.pictureData.buffer];
  }
}
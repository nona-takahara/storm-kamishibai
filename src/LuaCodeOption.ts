type LuaCodeOption = {
  compressV: boolean;
  compressH: boolean;
  startWith: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  readChannel: number;
}

export function getDefault(): LuaCodeOption {
  return {
    compressV: true,
    compressH: true,
    startWith: 1,
    width: 32,
    height: 32,
    offsetX: 0,
    offsetY: 0,
    readChannel: 1
  };
}

export type ConvertCardInfo = {

}

export default LuaCodeOption;
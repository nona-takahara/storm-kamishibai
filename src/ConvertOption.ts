type ConvertOption = {
  luaVCompress: boolean;
  luaHCompress: boolean;
  luaCardWidth: number;
  luaCardHeight: number;
  pictureOffsetX: number;
  pictureOffsetY: number;
  pictureSkipH: number;
  pictureSkipV: number;
}

export function getConvertOptionDefault(): ConvertOption {
  return {
    luaVCompress: true,
    luaHCompress: true,
    luaCardWidth: 32,
    luaCardHeight: 32,
    pictureOffsetX: 0,
    pictureOffsetY: 0,
    pictureSkipH: 0,
    pictureSkipV: 0,
  };
}

export type ConvertInfo = {
  offsetListIndex: number;
}

export type ConvertResultInfo = {
  offsetListIndex: number;
  finished: number;
  length: number;
}

export default ConvertOption;
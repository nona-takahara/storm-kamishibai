type LuaCodeOption = {
  luaVCompress: boolean;
  luaHCompress: boolean;
  luaCardIndexStartWith: number;
  luaCardWidth: number;
  luaCardHeight: number;
  luaOffsetX: number;
  luaOffsetY: number;
  pictureOffsetX: number;
  pictureOffsetY: number;
  pictureSkipH: number;
  pictureSkipV: number;
  luaReadChannel: number;
}

export function getDefault(): LuaCodeOption {
  return {
    luaVCompress: true,
    luaHCompress: true,
    luaCardIndexStartWith: 1,
    luaCardWidth: 32,
    luaCardHeight: 32,
    luaOffsetX: 0,
    luaOffsetY: 0,
    pictureOffsetX: 0,
    pictureOffsetY: 0,
    pictureSkipH: 0,
    pictureSkipV: 0,
    luaReadChannel: 1
  };
}

export type ConvertCardInfo = {

}

export default LuaCodeOption;
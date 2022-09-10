type LuaCodeOption = {
  isRollSign: boolean;
  luaRollSignGap: number;
  luaOffsetX: number;
  luaOffsetY: number;
  luaScaleH: number;
  luaScaleV: number;
  luaCardIndexStartWith: number;
  luaReadChannel: number;
}

export function getLuaCodeOptionDefault(): LuaCodeOption {
  return {
    isRollSign: false,
    luaRollSignGap: 0,
    luaOffsetX: 0,
    luaOffsetY: 0,
    luaScaleH: 1,
    luaScaleV: 1,
    luaCardIndexStartWith: 1,
    luaReadChannel: 1
  };
}

export default LuaCodeOption;
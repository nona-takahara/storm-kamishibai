type LuaCodeOption = {
  isRollSign: boolean;
  luaOffsetX: number;
  luaOffsetY: number;
  luaCardIndexStartWith: number;
  luaReadChannel: number;
}

export function getLuaCodeOptionDefault(): LuaCodeOption {
  return {
    isRollSign: false,
    luaOffsetX: 0,
    luaOffsetY: 0,
    luaCardIndexStartWith: 1,
    luaReadChannel: 1
  };
}

export default LuaCodeOption;
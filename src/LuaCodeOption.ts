type LuaCodeOption = {
  luaOffsetX: number;
  luaOffsetY: number;
  luaCardIndexStartWith: number;
  luaReadChannel: number;
}

export function getLuaCodeOptionDefault(): LuaCodeOption {
  return {
    luaOffsetX: 0,
    luaOffsetY: 0,
    luaCardIndexStartWith: 1,
    luaReadChannel: 1
  };
}

export default LuaCodeOption;
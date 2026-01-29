type LuaCodeOption = {
  isRollSign: boolean;
  luaRollSignGap: number;
  luaOffsetX: number;
  luaOffsetY: number;
  luaScaleH: number;
  luaScaleV: number;
  luaRotate: number;
  luaCardIndexStartWith: number;
  luaReadChannel: number;
  luaMaxLength: number;
}

export function getLuaCodeOptionDefault(): LuaCodeOption {
  return {
    isRollSign: false,
    luaRollSignGap: 0,
    luaOffsetX: 0,
    luaOffsetY: 0,
    luaScaleH: 1,
    luaScaleV: 1,
    luaRotate: 0,
    luaCardIndexStartWith: 1,
    luaReadChannel: 1,
    luaMaxLength: 4090
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default LuaCodeOption;

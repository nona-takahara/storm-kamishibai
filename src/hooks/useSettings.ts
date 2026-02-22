import { useCallback } from "react";
import type ConvertOption from "../ConvertOption";
import type LuaCodeOption from "../LuaCodeOption";
import { useAppStore } from "../store/AppStore";

export const useSettings = () => {
  const { setConvertOption, setLuaCodeOption, setNeedReconvert } =
    useAppStore();

  const handleChangeConvertSettings = useCallback(
    (opt: ConvertOption, need: boolean = false) => {
      setConvertOption((state) => {
        const ss: ConvertOption = { ...state };
        for (const key in opt) {
          if (Object.prototype.hasOwnProperty.call(opt, key)) {
            if (Object.prototype.hasOwnProperty.call(ss, key)) {
              (ss as Record<string, unknown>)[key] = (
                opt as Record<string, unknown>
              )[key];
            } else {
              console.error(`Key ${key} is not found in ConvertOption.`);
            }
          }
        }
        return ss;
      });
      setNeedReconvert((prev) => need || prev);
    },
    [setConvertOption, setNeedReconvert],
  );

  const handleChangeLuaCodeSettings = useCallback(
    (opt: LuaCodeOption) => {
      setLuaCodeOption((state) => {
        const ss: LuaCodeOption = { ...state };
        for (const key in opt) {
          if (Object.prototype.hasOwnProperty.call(opt, key)) {
            if (Object.prototype.hasOwnProperty.call(ss, key)) {
              (ss as Record<string, unknown>)[key] = (
                opt as Record<string, unknown>
              )[key];
            } else {
              console.log(`Key ${key} is not found in LuaCodeOption.`);
            }
          }
        }
        return ss;
      });
    },
    [setLuaCodeOption],
  );

  return { handleChangeConvertSettings, handleChangeLuaCodeSettings };
};

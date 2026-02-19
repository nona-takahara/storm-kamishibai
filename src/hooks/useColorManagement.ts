import { useCallback } from "react";
import { useAppStore } from "../store/AppStore";

export const useColorManagement = () => {
  const {
    setOrderTable,
    setTransparentStartOrder,
    setNeedReconvert,
    setColorSet,
    transparentStartOrderRef,
  } = useAppStore();

  const handleOnDrawChange = useCallback(
    (colorIndex: number, drawFlag: boolean) => {
      setOrderTable((state) => {
        let k = state.slice();
        const o = k[colorIndex];
        let to = transparentStartOrderRef.current;

        if (o < to && drawFlag) {
          k = k.map((v) => (v > o && v < to ? v - 1 : v));
          k[colorIndex] = --to;
        } else if (o >= to && !drawFlag) {
          k = k.map((v) => (v >= to && v < o ? v + 1 : v));
          k[colorIndex] = to++;
        }

        setTransparentStartOrder(to);
        setNeedReconvert(true);
        return k;
      });
    },
    [
      setOrderTable,
      setTransparentStartOrder,
      setNeedReconvert,
      transparentStartOrderRef,
    ],
  );

  const handleOnMoveUpClick = useCallback(
    (colorIndex: number) => {
      setOrderTable((state) => {
        const k = state.slice();
        const o = k[colorIndex];

        k[k.indexOf(o - 1)] = o;
        k[colorIndex] = o - 1;

        setNeedReconvert(true);
        return k;
      });
    },
    [setOrderTable, setNeedReconvert],
  );

  const handleOnMoveDownClick = useCallback(
    (colorIndex: number) => {
      setOrderTable((state) => {
        const k = state.slice();
        const o = k[colorIndex];

        k[k.indexOf(o + 1)] = o;
        k[colorIndex] = o + 1;

        setNeedReconvert(true);
        return k;
      });
    },
    [setOrderTable, setNeedReconvert],
  );

  const handleOnColorChange = useCallback(
    (colorIndex: number, colorInput: string) => {
      setColorSet((state) => {
        const c = state.slice();
        c[colorIndex].setConvertedRGB(colorInput);
        return c;
      });
    },
    [setColorSet],
  );

  return {
    handleOnDrawChange,
    handleOnMoveUpClick,
    handleOnMoveDownClick,
    handleOnColorChange,
  };
};

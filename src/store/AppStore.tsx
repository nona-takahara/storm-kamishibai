import { create } from 'zustand';
import React from 'react';
import Color from '../Color';
import type LuaCodeOption from '../LuaCodeOption';
import { getLuaCodeOptionDefault } from '../LuaCodeOption';
import type ConvertOption from '../ConvertOption';
import { getConvertOptionDefault } from '../ConvertOption';
import FinalLuaCode from '../gencode/FinalLuaCode';

type ModalShow = "" | "help" | "about";

interface AppState {
  // Image related
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  imageLoading: boolean;

  // Color related
  colorSet: Color[];
  orderTable: number[];
  transparentStartOrder: number;

  // Convert related
  convertProgress: number;
  isWorking: boolean;
  needReconvert: boolean;
  generatedCode: FinalLuaCode;

  // Options
  convertOption: ConvertOption;
  luaCodeOption: LuaCodeOption;

  // UI
  modalShow: ModalShow;
}

interface AppStore extends AppState {
  // Setters
  setImageUrl: (value: string) => void;
  setImageWidth: (value: number) => void;
  setImageHeight: (value: number) => void;
  setImageLoading: (value: boolean) => void;

  setColorSet: (value: Color[] | ((prev: Color[]) => Color[])) => void;
  setOrderTable: (value: number[] | ((prev: number[]) => number[])) => void;
  setTransparentStartOrder: (value: number | ((prev: number) => number)) => void;

  setConvertProgress: (value: number) => void;
  setIsWorking: (value: boolean) => void;
  setNeedReconvert: (value: boolean | ((prev: boolean) => boolean)) => void;
  setGeneratedCode: (value: FinalLuaCode) => void;

  setConvertOption: (value: ConvertOption | ((prev: ConvertOption) => ConvertOption)) => void;
  setLuaCodeOption: (value: LuaCodeOption | ((prev: LuaCodeOption) => LuaCodeOption)) => void;

  setModalShow: (value: ModalShow) => void;

  // Refs
  colorSetRef: React.MutableRefObject<Color[]>;
  orderTableRef: React.MutableRefObject<number[]>;
  transparentStartOrderRef: React.MutableRefObject<number>;
  needReconvertRef: React.MutableRefObject<boolean>;
  convertOptionRef: React.MutableRefObject<ConvertOption>;
  luaCodeOptionRef: React.MutableRefObject<LuaCodeOption>;
}

const useAppStore = create<AppStore>((set, get) => {
  // Refs
  const colorSetRef = React.createRef<Color[]>();
  const orderTableRef = React.createRef<number[]>();
  const transparentStartOrderRef = React.createRef<number>();
  const needReconvertRef = React.createRef<boolean>();
  const convertOptionRef = React.createRef<ConvertOption>();
  const luaCodeOptionRef = React.createRef<LuaCodeOption>();

  // Initialize refs
  colorSetRef.current = [];
  orderTableRef.current = [];
  transparentStartOrderRef.current = 0;
  needReconvertRef.current = false;
  convertOptionRef.current = getConvertOptionDefault();
  luaCodeOptionRef.current = getLuaCodeOptionDefault();

  return {
    // Initial state
    imageUrl: "",
    imageWidth: 0,
    imageHeight: 0,
    imageLoading: false,
    colorSet: [],
    orderTable: [],
    transparentStartOrder: 0,
    convertProgress: 0,
    isWorking: false,
    needReconvert: false,
    generatedCode: new FinalLuaCode([]),
    convertOption: getConvertOptionDefault(),
    luaCodeOption: getLuaCodeOptionDefault(),
    modalShow: "",

    // Setters
    setImageUrl: (value) => set({ imageUrl: value }),
    setImageWidth: (value) => set({ imageWidth: value }),
    setImageHeight: (value) => set({ imageHeight: value }),
    setImageLoading: (value) => set({ imageLoading: value }),

    setColorSet: (value) => {
      const next = typeof value === "function" ? value(get().colorSet) : value;
      colorSetRef.current = next;
      set({ colorSet: next });
    },
    setOrderTable: (value) => {
      const next = typeof value === "function" ? value(get().orderTable) : value;
      orderTableRef.current = next;
      set({ orderTable: next });
    },
    setTransparentStartOrder: (value) => {
      const next = typeof value === "function" ? value(get().transparentStartOrder) : value;
      transparentStartOrderRef.current = next;
      set({ transparentStartOrder: next });
    },

    setConvertProgress: (value) => set({ convertProgress: value }),
    setIsWorking: (value) => set({ isWorking: value }),
    setNeedReconvert: (value) => {
      const next = typeof value === "function" ? value(get().needReconvert) : value;
      needReconvertRef.current = next;
      set({ needReconvert: next });
    },
    setGeneratedCode: (value) => set({ generatedCode: value }),

    setConvertOption: (value) => {
      const next = typeof value === "function" ? value(get().convertOption) : value;
      convertOptionRef.current = next;
      set({ convertOption: next });
    },
    setLuaCodeOption: (value) => {
      const next = typeof value === "function" ? value(get().luaCodeOption) : value;
      luaCodeOptionRef.current = next;
      set({ luaCodeOption: next });
    },

    setModalShow: (value) => set({ modalShow: value }),

    // Refs
    colorSetRef,
    orderTableRef,
    transparentStartOrderRef,
    needReconvertRef,
    convertOptionRef,
    luaCodeOptionRef,
  };
});

export { useAppStore };
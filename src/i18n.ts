import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      app: {
        contact: "Contact form",
        help: "Help",
        about: "About",
      },
      settings: {
        reconvTab: "Analysis settings",
        mainTab: "Render settings",
      },
      convert: {
        start: "Start analysis",
        stop: "Stop analysis",
        apply: "Apply settings",
        needsAnalyze: "Analysis is required",
        progressDone: "Analysis {{percent}}% complete",
      },
      landing: {
        title: "What can Storm Kamishibai do?",
        exampleAlt: "Example image",
      },
      fileSelector: {
        title: "Image selection",
        tooltipSize: "{{width}} x {{height}}",
        loading: "Loading...",
      },
      luaCode: {
        title: "Generated Lua code",
        characters: "characters",
        overrun:
          "Generated code was too long, so it was split into multiple Lua blocks.",
        colorSplit: "Some color commands were also split.",
      },
      basic: {
        rollsignMode: "Rollsign mode",
        rollsignBefore: "",
        rollsignAfter:
          " output is generated. Some settings below are disabled.",
        gap: "Gap between cards",
        warning32:
          "If clip height + gap is not 32, you need to modify the Selector microcontroller Lua code.",
        startIndex: "First image index",
        readChannel: "Numeric input channel",
        maxCharactersPerBlock: "Maximum characters per block (max 8192)",
        offset: "Drawing offset",
        scale: "Drawing scale",
        rotate: "Rotate",
      },
      main: {
        info: "Changing these analysis options requires running analysis again.",
        imageConversionSettings: "Image clipping settings",
        size: "Size",
        width: "Width",
        height: "Height",
        x: "X",
        y: "Y",
        horizonal: "Horizontal",
        vectral: "Vertical",
        offset: "Valid image position offset",
        skip: "Skip",
        colorOrderAndDrawFlags: "Draw order / draw flags",
      },
      modal: {
        helpTitle: "How to use Storm Kamishibai",
        aboutTitle: "About this app",
      },
    },
  },
  ja: {
    translation: {
      app: {
        contact: "問い合わせフォーム",
        help: "使い方",
        about: "このアプリについて",
      },
      settings: {
        reconvTab: "解析系設定",
        mainTab: "描画系設定",
      },
      convert: {
        start: "解析開始",
        stop: "解析停止",
        apply: "設定適用",
        needsAnalyze: "解析が必要です",
        progressDone: "解析 {{percent}}% 完了",
      },
      landing: {
        title: "Storm Kamishibaiで何ができる？",
        exampleAlt: "見本画像",
      },
      fileSelector: {
        title: "画像選択",
        tooltipSize: "{{width}} x {{height}}",
        loading: "読み込み中...",
      },
      luaCode: {
        title: "生成Luaコード",
        characters: "文字",
        overrun: "生成されたコードが長いため、Luaコードを分割しました。",
        colorSplit: "一部の色情報命令が分割されています。",
      },
      basic: {
        rollsignMode: "巻き取り字幕モード",
        rollsignBefore: "",
        rollsignAfter:
          "用の変換結果を出力します。以下の一部設定は無効となります。",
        gap: "幕の間隔",
        warning32:
          "切り抜き高さ+幕間の隙間が32以外になるときは、SelectorマイコンのLuaコードを改造する必要があります。",
        startIndex: "先頭の画像インデックス",
        readChannel: "読み込む数値チャンネル",
        maxCharactersPerBlock: "1ブロックの最大文字数(最大8192)",
        offset: "描画オフセット",
        scale: "描画倍率",
        rotate: "回転",
      },
      main: {
        info: "この解析オプションを変更すると再度解析が必要になります。",
        imageConversionSettings: "画像切り抜き設定",
        size: "サイズ",
        width: "幅",
        height: "高さ",
        x: "X",
        y: "Y",
        horizonal: "水平",
        vectral: "垂直",
        offset: "有効画像位置オフセット",
        skip: "スキップ",
        colorOrderAndDrawFlags: "描画順序・描画フラグ",
      },
      modal: {
        helpTitle: "Storm Kamishibaiの使い方",
        aboutTitle: "Storm Kamishibaiについて",
      },
    },
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: "ja",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

Storm Kamishibai v0.5.4

(C) 2022, 2026 Nona Takahara

- [GitHub Repository](https://github.com/nona-takahara/storm-kamishibai)
- [問い合わせフォーム(Google Forms)](https://forms.gle/TRxMsVQLBrCc3yJF7)
- GitHub [nona-takahara](https://github.com/nona-takahara)
- Twitter [@nona_takahara](https://twitter.com/nona_takahara)

このアプリの変換処理は、ローカルで完結します。

---

Create React Appを利用して作成しました。

色変換テーブルは、Ossan3氏によるものを使用しています([LUA Display Color Picker](https://steamcommunity.com/sharedfiles/filedetails/?id=2569574227))。

その他OSSのライセンス表記は自動生成のファイル内にあるもので代えさせていただきます。

---

## アップデートログ

### v0.5.4

- 開発環境を更新（挙動は更新していません）

### v0.5.3

- v0.5.0以降、生成結果が少なくなる再解析時にゴミデータが残る問題を修正
- Luaコードの最大文字数を変更する機能を追加
- 古いWebブラウザへの対応を省略し、コード等を効率化

### v0.5.2

- 描画の拡大機能を追加
- 描画の回転機能を追加
- 画像プレビューの拡大縮小機能を追加
- UIにアイコンを導入、その他調整を実施

### v0.5.1

- 解析に関するステータスメッセージの表示を修正
- 画像の幅・高さに関する情報の表示位置を修正
- 幕の描画に関しての機能を追加
- その他表記上の問題を修正

### v0.5.0

- 変換全体の処理の改善
- UIの大幅変更
- 左下1ドットが欠けることがある問題の修正
- 切り抜き範囲・スキップ設定を追加
- くーく さんの[Analog Destination Indicator(Rollsign)](https://steamcommunity.com/sharedfiles/filedetails/?id=2850204940) に対応
- 変換結果zipファイルダウンロード機能の追加

### v0.4.0

- 4096文字制限に対応
- トップページのテキストを更新

### v0.3.2

- 暫定版のランディングボックスを設置
- 文字数カウントをバイト数に変更
- 空のフレームでのLuaコード出力を抑制

### v0.3.1

- 画像の切り抜きの高さ・幅が異なるときにどちらも高さになる問題を修正
- 生成されるLuaコードにendが欠けていた問題を修正

### v0.3.0

- 一般公開初版

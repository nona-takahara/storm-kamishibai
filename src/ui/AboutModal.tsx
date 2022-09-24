import { Modal } from "react-bootstrap";
import ModalProps from "../ModalProps";

export default function AboutModal(props: ModalProps) {
  return (
    <Modal show={props.show} onHide={() => { props.onClose() }} aria-labelledby="contained-modal-title-vcenter" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Storm Kamishibai について</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section>
          <p>
            Storm Kamishibai v0.5.3<br />
            (C) 2022 Nona Takahara
          </p>
          <ul>
            <li><a href="https://github.com/nona-takahara/storm-kamishibai" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
            <li><a href="https://forms.gle/TRxMsVQLBrCc3yJF7" target="_blank" rel="noopener noreferrer">問い合わせフォーム(Google Forms)</a></li>
            <li>GitHub <a href="https://github.com/nona-takahara" target="_blank" rel="noopener noreferrer">nona-takahara</a></li>
            <li>Twitter <a href="https://twitter.com/nona_takahara" target="_blank" rel="noopener noreferrer">@nona_takahara</a></li>
          </ul>
          <p>
            このアプリの変換処理は、ローカルで完結します。
          </p>
        </section>
        <hr />
        <section>
          <p>
            Create React Appを利用して作成しました。
          </p>
          <p>
            色変換テーブルは、Ossan3氏によるものを使用しています(
            <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2569574227" target="_blank" rel="noopener noreferrer">LUA Display Color Picker</a>
            )。
          </p>
          <p>
            その他OSSのライセンス表記は自動生成のファイル内にあるもので代えさせていただきます。
          </p>
        </section>
        <hr />
        <h4>アップデートログ</h4>
        <section>
          <h5>v0.5.3</h5>
          <ul>
            <li>v0.5.0以降、生成結果が少なくなる再解析時にゴミデータが残る問題を修正</li>
            <li>Luaコードの最大文字数を変更する機能を追加</li>
            <li>古いWebブラウザへの対応を省略し、コード等を効率化</li>
          </ul>
        </section>
        <section>
          <h5>v0.5.2</h5>
          <ul>
            <li>描画の拡大機能を追加</li>
            <li>描画の回転機能を追加</li>
            <li>画像プレビューの拡大縮小機能を追加</li>
            <li>UIにアイコンを導入、その他調整を実施</li>
          </ul>
        </section>
        <section>
          <h5>v0.5.1</h5>
          <ul>
            <li>解析に関するステータスメッセージの表示を修正</li>
            <li>画像の幅・高さに関する情報の表示位置を修正</li>
            <li>幕の描画に関しての機能を追加</li>
            <li>その他表記上の問題を修正</li>
          </ul>
        </section>
        <section>
          <h5>v0.5.0</h5>
          <ul>
            <li>変換全体の処理の改善</li>
            <li>UIの大幅変更</li>
            <li>左下1ドットが欠けることがある問題の修正</li>
            <li>切り抜き範囲・スキップ設定を追加</li>
            <li>くーく さんの<a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2850204940" target="_blank" rel="noopener noreferrer">Analog Destination Indicator(Rollsign)</a> に対応</li>
            <li>変換結果zipファイルダウンロード機能の追加</li>
          </ul>
        </section>
        <section>
          <h5>v0.4.0</h5>
          <ul>
            <li>4096文字制限に対応</li>
            <li>トップページのテキストを更新</li>
          </ul>
        </section>
        <section>
          <h5>v0.3.2</h5>
          <ul>
            <li>暫定版のランディングボックスを設置</li>
            <li>文字数カウントをバイト数に変更</li>
            <li>空のフレームでのLuaコード出力を抑制</li>
          </ul>
        </section>
        <section>
          <h5>v0.3.1</h5>
          <ul>
            <li>画像の切り抜きの高さ・幅が異なるときにどちらも高さになる問題を修正</li>
            <li>生成されるLuaコードにendが欠けていた問題を修正</li>
          </ul>
        </section>
        <section>
          <h5>v0.3.0</h5>
          <ul>
            <li>一般公開初版</li>
          </ul>
        </section>
      </Modal.Body>
    </Modal>
  );
}

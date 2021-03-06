import { Modal } from "react-bootstrap";
import ModalProps from "../ModalProps";

export default function (props: ModalProps) {
  return (
    <Modal show={props.show} onHide={() => { props.onClose() }} aria-labelledby="contained-modal-title-vcenter" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Storm Kamishibai について</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section>
          <p>
            Storm Kamishibai v0.4.0<br />
            (C) 2022 Nona Takahara
          </p>
          <ul>
            <li><a href="https://github.com/nona-takahara/storm-kamishibai">GitHub Repository</a></li>
            <li><a href="https://forms.gle/TRxMsVQLBrCc3yJF7">問い合わせフォーム(Google Forms)</a></li>
            <li>GitHub <a href="https://github.com/nona-takahara">nona-takahara</a></li>
            <li>Twitter <a href="https://twitter.com/nona_takahara">@nona_takahara</a></li>
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
            <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2569574227">LUA Display Color Picker</a>
            )。
          </p>
          <p>
            その他OSSのライセンス表記は自動生成のファイル内にあるもので代えさせていただきます。
          </p>
        </section>
        <hr />
        <h4>アップデートログ</h4>
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

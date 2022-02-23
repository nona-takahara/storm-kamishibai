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
            Storm Kamishibai v0.3.0<br />
            (C) 2022 Nona Takahara
          </p>
          <ul>
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
          <h5>v0.3.0</h5>
          <ul>
            <li>一般公開初版</li>
          </ul>
        </section>
      </Modal.Body>
    </Modal>
  );
}

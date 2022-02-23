import { Modal } from "react-bootstrap";
import ModalProps from "../ModalProps";

export default function (props: ModalProps) {
  return (
    <Modal show={props.show} onHide={() => { props.onClose() }} aria-labelledby="contained-modal-title-vcenter" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Storm Kamishibaiの使い方</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <section>
            <h4>1. モニターに表示する画像を用意しよう</h4>
            <p>
              まずは、モニターに表示したい画像を用意しましょう。
            </p>
            <p>
              モニターの長さ1ブロックに32ピクセルが対応します。あらかじめ減色加工しておくと変換スピードがアップします。
            </p>
            <p>
              複数枚の画像を切り替えて使うモニターを作るときは、指定する番号が若い順に上から下になるように並べます。縦が長くなったら、右の列に移って並べます。
            </p>
          </section>
          <section>
            <h4>2. 画像を読み込もう</h4>
            <p>
              「参照」ボタンを押すと、ファイルダイアログが表示されるので、読み込みます。
            </p>
            <p>
              この際に読み込んだファイルは外部に送信しません。すべてあなたのコンピュータ内で処理が完結します。
            </p>
            <p>
              色数が多い画像は読み込み時にコンピュータがしばらく固まるかもしれません。今後修正する予定です。
            </p>
          </section>
          <section>
            <h4>3. 画像の設定して階層関係を変更しよう</h4>
            <p>
              幅と高さをモニターに表示する1枚分の画像の大きさに合わせます。その他の設定は必要に応じて変更します。
            </p>
            <p>
              色の階層関係をうまく調整すると、画像を描画するコードが短く済むことがあります。よくわからない時は変更しなくても構いません。
            </p>
          </section>
          <section>
            <h4>4. 変換してみる</h4>
            <p>
              「変換開始」ボタンを押すと変換がスタートします。画像が大きかったり、色数が多いとしばらくコンピュータが固まるかもしれませんが、ご了承ください。
            </p>
            <p>
              変換は少し時間がかかります。コンピュータに負荷をかけすぎないように調整しているので、他の作業ができるかもしれません。
            </p>
          </section>
          <section>
            <h4>5. StormworksのマイコンのLuaブロックに貼りつける</h4>
            <p>
              コードが完成したら、1つずつコピーして、Luaブロックに貼りつけます。
            </p>
            <p>
              最後に、コンポジットノードと映像ノードを適切に配線すると、画像が描画できるようになっているはずです。
            </p>
          </section>
          <section>
            <h4>6. うまくいかないときは</h4>
            <p>
              うまくいかないときは、次の点を一度チェックしてみてください。
              <ul>
                <li>コンポジットの、指定した数値チャンネルに「整数」が入っているか</li>
                <li>モニターやHUDに電源や電源On/Off信号が繋がっているか</li>
              </ul>
            </p>
            <p>
              それでも動かない時は、たぶんこちらの不手際です。お気軽にお知らせください。
            </p>
            <p>
              現状はTwitter(<a href="https://twitter.com/nona_takahara">@nona_takahara</a>)が主要な窓口です。今後不具合報告フォームを設ける予定です。
            </p>
          </section>
        </div>
      </Modal.Body>
    </Modal>
  );
}
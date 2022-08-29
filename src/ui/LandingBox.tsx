import { Card } from "react-bootstrap";

type LandingBoxProps = {
  isVisible: boolean;
}

export default function LandingBox(props: LandingBoxProps) {
  return props.isVisible && (
    <Card>
      <Card.Header>
          Storm Kamishibaiで何ができる？
        </Card.Header>
      <Card.Body>
        <p><img src='example.png' className="m-1 float-end"/>Storm Kamishibaiは、右のような<b>一定サイズの画像</b>を<b>複数連結した</b>画像を切り抜いて、番号で1つずつ呼び出すLuaコードを生成できるツールです。</p>
        <p>バスや列車のLED表示器のようなものを再現したり、簡単なアニメーションを描画することを想定して作成しています。</p>
        <p>指定する画像ファイルは、あらかじめ他の編集ソフトで、ドットバイドットにして減色しておいてください。</p>
        <p>詳しい使い方は、<a href="https://nico.ms/sm40118699">紹介動画(ニコニコ動画)</a>が参考になると思います。</p>
        <p>バグや要望など、お問い合わせは<a href="https://forms.gle/TRxMsVQLBrCc3yJF7">こちらのフォーム</a>からどうぞ。</p>
      </Card.Body>
    </Card>
  ) || <></>;
}

import PictureData from '../PictureData';
import Vector2D from '../Vector2D';
import ConvertCommands from './ConvertCommand';
import ConvertedData from './ConvertedData';
import Results from './Results';

export default {}

// eslint-disable-next-line
const ctx: Worker = self as any;

// 送れるメッセージの種類：変換開始
// 返すメッセージの種類：変換後データ(1カラーレイヤーごとに渡す)
ctx.addEventListener('message', (evt: MessageEvent<ConvertCommands>) => {
  let d = evt.data;
  const vCount = Math.floor(d.pictureHeight / d.cropHeight);
  const hCount = Math.floor(d.pictureWidth / d.cropWidth);
  const phase = hCount * vCount * d.colorSet.length;

  const pic = d.pictureData.map((v) => d.orderTable[v]);
  ctx.postMessage(new Results(1 / phase, true, undefined));

  for (let x = 0; x < hCount; x++) {
    for (let y = 0; y < vCount; y++) {
      for (let l = 0; l < d.colorSet.length; l++) {
        let picIndex = d.orderTable.indexOf(l);
        ctx.postMessage(new Results(
          (((x * vCount) + y) * d.colorSet.length + l + 1) / phase, true,
          new ConvertedData(
            (d.drawFlagTable[picIndex]) ?
            new Uint32Array() :
            convertLayer(pic,
              d.pictureWidth, d.pictureHeight,
              d.cropWidth, d.cropHeight,
              x * d.cropWidth, y * d.cropHeight, l),
            y + vCount * x, l, d.colorSet[picIndex])
        ));
      }
    }
  }
  ctx.postMessage(new Results(1, false, undefined));
});

function convertLayer(picture: Uint32Array, w: number, h: number, cw: number, ch: number, offsetX: number, offsetY: number, targetColor: number) {
  const indexer = makeIndexer(w, h, offsetX, offsetY);
  const indexerZ = makeIndexer(cw, ch, 0, 0);
  const rectangleMatrix = new Array<Array<Vector2D>>(ch * cw);
  const drawCodes = Array<number>();

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      rectangleMatrix[indexerZ(x, y)] = new Array<Vector2D>();
    }
  }

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const f: boolean =
        (picture[indexer(x, y)] <= targetColor)
        && ((x === 0 || picture[indexer(x - 1, y)] > targetColor)
          || (y === 0 || picture[indexer(x, y - 1)] > targetColor));
      if (f) {
        let tx: number, ty: number, ox!: number | undefined;
        let f = true;
        for (ty = y; ty <= ch; ty++) {
          if (ty !== ch) {
            for (
              tx = x;
              tx < cw
              && picture[indexer(tx, ty)] <= targetColor;
              tx++
            );
            tx--;
          } else {
            tx = 0;
          }

          // この処理形態のせいで、うまく処理できなかったのが2つ続く……
          if (ox === undefined) {
            ox = tx;
          }

          if (ox > tx) {
            // 「不合格が出なければ記録する」ために、
            // 「不合格ならtrue」を返すようにする
            if (!rectangleMatrix[indexerZ(ox, ty - 1)].some((e) => x > e.x && y > e.y)) {
              rectangleMatrix[indexerZ(ox, ty - 1)].push(new Vector2D(x, y));
            }
            ox = tx;
          }

          if (tx < x) {
            f = false;
            break;
          }
        }
      }
    }
  }

  const counter = new Uint8Array(cw * ch);
  counter.fill(0);
  for (let i = 0; i < rectangleMatrix.length; i++) {
    const el = rectangleMatrix[i];
    el?.forEach((v) => {
      const ex = i % cw, ey = Math.floor(i / cw);
      let f = false; // 未描画のエリアがあればtrue。falseの限りチェック
      let f2 = false; // 自分の色が描画エリアにあればtrue
      for (let ty = v.y; ty <= ey; ty++) {
        for (let tx = v.x; tx <= ex; tx++) {
          f = f || (counter[indexerZ(tx, ty)] === 0);
          f2 = f2 || (picture[indexer(tx, ty)] === targetColor);
        }
      }

      if (f && f2) {
        drawCodes.push(v.x, v.y, ex - v.x + 1, ey - v.y + 1);
        for (let ty = v.y; ty <= ey; ty++) {
          for (let tx = v.x; tx <= ex; tx++) {
            counter[indexerZ(tx, ty)] = 1;
          }
        }
      }
    });
  }

  return Uint32Array.from(drawCodes);
}

function makeIndexer(width: number, height: number, offsetX: number, offsetY: number) {
  return (x: number, y: number) => {
    return (offsetY + y) * width + (offsetX + x);
  }
}
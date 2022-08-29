import Vector2D from '../Vector2D';
import ConvertCardCommand from '../worker/ConvertCardCommand';
import ConvertSucceedCommand from '../worker/ConvertSucceedCommand';
import WorkerCommand from '../worker/WorkerCommand';

export default {}

// eslint-disable-next-line
const ctx: Worker = self as any;

ctx.addEventListener('message', (evt: MessageEvent<WorkerCommand>) => {
  const data = evt.data;
  if (data instanceof ConvertCardCommand) {
    const res: Uint32Array[] = [];
    for (let i = 0; i < data.palleteLength; i++) {
      res.push(convertLayer(data.picture, data.width, data.height, i));
    }
    const cmd = new ConvertSucceedCommand(res);
    cmd.post(ctx);
  }
});

// 処理変更：既に切り出された画像に対して処理する
function convertLayer(picture: Uint32Array, w: number, h: number, targetColor: number) {
  const indexer = makeIndexer(w, h);  

  const canDraw = (x: number, y: number) => (picture[indexer(x, y)] <= targetColor);
  const cannotDraw = (x: number, y: number) => (picture[indexer(x, y)] > targetColor);
  const rectangleMatrix = new Array<Array<Vector2D>>(h * w);
  const drawCodes = Array<number>();
 
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      rectangleMatrix[indexer(x, y)] = new Array<Vector2D>();
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const f: boolean = (canDraw(x, y))
        && ((x === 0 || cannotDraw(x - 1, y)) || (y === 0 || cannotDraw(x, y - 1)));
      if (f) {
        let tx: number, ty: number, ox!: number | undefined;
        let f = true;
        for (ty = y; ty <= h; ty++) {
          if (ty !== h) {
            for (tx = x; tx < w && canDraw(tx, ty); tx++);
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
            if (!rectangleMatrix[indexer(ox, ty - 1)].some((e) => x > e.x && y > e.y)) {
              rectangleMatrix[indexer(ox, ty - 1)].push(new Vector2D(x, y));
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

  const counter = new Uint8Array(w * h);
  counter.fill(0);
  for (let i = 0; i < rectangleMatrix.length; i++) {
    const el = rectangleMatrix[i];
    el?.forEach((v) => {
      const ex = i % w, ey = Math.floor(i / w);
      let f = false; // 未描画のエリアがあればtrue。falseの限りチェック
      let f2 = false; // 自分の色が描画エリアにあればtrue
      for (let ty = v.y; ty <= ey; ty++) {
        for (let tx = v.x; tx <= ex; tx++) {
          f = f || (counter[indexer(tx, ty)] === 0);
          f2 = f2 || (picture[indexer(tx, ty)] === targetColor);
        }
      }

      if (f && f2) {
        drawCodes.push(v.x, v.y, ex - v.x + 1, ey - v.y + 1);
        for (let ty = v.y; ty <= ey; ty++) {
          for (let tx = v.x; tx <= ex; tx++) {
            counter[indexer(tx, ty)] = 1;
          }
        }
      }
    });
  }

  return Uint32Array.from(drawCodes);
}

function makeIndexer(width: number, height: number) {
  return (x: number, y: number) => {
    return y * width + x;
  }
}
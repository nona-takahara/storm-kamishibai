import Color from "../Color";
import LuaCodeOption from "../LuaCodeOption";
import LuaCodeSnippet from "../LuaCodeSnippet";
import FinalLuaCode from "./FinalLuaCode";

export default function FinalizeLuaCode(sn: string[][], orderdColor: Color[], opt: LuaCodeOption): FinalLuaCode {
  let ph = {
    offsetX: (opt.luaOffsetX === 0) ? '' : `+${opt.luaOffsetX}`,
    offsetY: (opt.luaOffsetY === 0) ? '' : `+${opt.luaOffsetY}`,
    funcV: (opt.luaVCompress)? '\nfunction V(x,y,h)R(x,y,1,h)end' : '',
    funcH: (opt.luaHCompress)? '\nfunction H(x,y,w)R(x,y,w,1)end' : ''
  }
  let outerFront = `function R(x,y,w,h)S.drawRectF(x${ph.offsetX},y${ph.offsetY},w,h)end${ph.funcV}${ph.funcH}
I=0
function onTick()I=input.getNumber(${opt.luaReadChannel})end
function onDraw()S=screen C=S.setColor`;
  let outerBottom = '\nend';
  let maxLength = 4090 - (bytelen(outerFront) + bytelen(outerBottom));
  let haveOverRun = false;
  let haveColorDiv = false;

  let r: string[] = [];
  let blockLP = '';
  for (let i = 0; i < sn.length; i++) {
    const k = sn[i].map((v, j) => {
      if (v !=='') {
        return `C(${orderdColor[j].convertedR},${orderdColor[j].convertedG},${orderdColor[j].convertedB})${v}`;
      } else { return '';}
    }).reverse();

    // 基本のフレーム文法作成
    let frameLP = frame(i + opt.luaCardIndexStartWith, k.join(''));
    let frameSize = bytelen(frame(i + opt.luaCardIndexStartWith, ''));

    // 問題がない場合は単純追加
    if (blockLP !== '' && (bytelen(blockLP) + bytelen(frameLP)) > maxLength) {
      r.push(blockLP);
      blockLP = '';
    }

    // そもそも最長を越えてしまう場合は分割実施
    if (bytelen(frameLP) > maxLength) {
      haveOverRun = true;
      frameLP = '';
      for (let colorLP of k) {
        if (colorLP === undefined) colorLP = '';
        if ((bytelen(frameLP + colorLP) + frameSize) > maxLength) {
          if (frameLP !== '') {
            r.push(frame(i + opt.luaCardIndexStartWith, frameLP));
          }

          if ((bytelen(colorLP) + frameSize) > maxLength) {
            haveColorDiv = true;

            let v_color = colorLP.slice(0, colorLP.indexOf(')') + 1);
            colorLP = colorLP.slice(colorLP.indexOf(')') + 1);
            const localMaxLength = maxLength - frameSize - bytelen(v_color);

            while(bytelen(colorLP) > localMaxLength) {
              let cutpoint = colorLP.lastIndexOf(')', localMaxLength - 1) + 1;
              r.push(frame(i + opt.luaCardIndexStartWith, v_color + colorLP.slice(0, cutpoint)));
              colorLP = colorLP.slice(cutpoint);
            }

            colorLP = v_color + colorLP;
          }
          frameLP = '';
        }
        frameLP += colorLP;
      }
      frameLP = frame(i + opt.luaCardIndexStartWith, frameLP);
    }

    blockLP += frameLP;
  }
  if (blockLP !== '') r.push(blockLP);
  return new FinalLuaCode(r.map((v) => outerFront + v + outerBottom), haveOverRun, haveColorDiv);
}

function frame(index: number, snippet: string) {
  if (snippet.length === 0) {
    return '';
  } else {
    return `\nif I==${index}then ${snippet}end`;
  }
}

function bytelen(s: string) {
  return (new Blob([s])).size;
}
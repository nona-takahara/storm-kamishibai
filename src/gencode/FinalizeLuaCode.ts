import Color from "../Color";
import ConvertOption from "../ConvertOption";
import LuaCodeOption from "../LuaCodeOption";
import FinalLuaCode from "./FinalLuaCode";

export default function FinalizeLuaCode(sn: string[][], orderdColor: Color[], copt: ConvertOption, lopt: LuaCodeOption): FinalLuaCode {
  if (true) {
    const ph = {
      offsetX: (lopt.luaOffsetX === 0) ? '' : `+${lopt.luaOffsetX}`,
      offsetY: (lopt.luaOffsetY === 0) ? '' : `+${lopt.luaOffsetY}`,
      funcV: (copt.luaVCompress) ? '\nfunction V(x,y,h)R(x,y,1,h)end' : '',
      funcH: (copt.luaHCompress) ? '\nfunction H(x,y,w)R(x,y,w,1)end' : ''
    }
    const outerFront = `function R(x,y,w,h)S.drawRectF(x${ph.offsetX},y${ph.offsetY},w,h)end${ph.funcV}${ph.funcH}
I=0
function onTick()I=input.getNumber(${lopt.luaReadChannel})end
function onDraw()S=screen C=S.setColor`;
    const outerBottom = '\nend';
    return standardFinalize(sn, orderdColor, lopt, outerFront, outerBottom, defaultFrame);
  } else {
    const outerFront = `function R(x,y,w,h)S.drawRectF(x,y-Y+M,w,h)end
    function V(x,y,h)R(x,y,1,h)end
    function H(x,y,w)R(x,y,w,1)end
    function j(a,b) r=0 if I==a then M=0 r=1 elseif I==b then M=32 r=1 end return r==1 end
    function J(n) return j(n,n-1)end
    function J1(mx) return j(1,mx)end
    I=0
    function onTick()I=input.getNumber(1) Y=I%100 I=I//100 end
    function onDraw()S=screen C=S.setColor`;
    const outerBottom = '\nend';
    return standardFinalize(sn, orderdColor, lopt, outerFront, outerBottom, rollFinalize(sn.length));
  }
}

function standardFinalize(sn: string[][], orderdColor: Color[], opt: LuaCodeOption, outerFront: string, outerBottom: string, frame: (index: number, offset: number, snippet: string) => string): FinalLuaCode {
  let maxLength = 4090 - (bytelen(outerFront) + bytelen(outerBottom));
  let haveOverRun = false;
  let haveColorDiv = false;

  let r: string[] = [];
  let blockLP = '';
  for (let i = 0; i < sn.length; i++) {
    const k = sn[i].map((v, j) => {
      if (v !== '') {
        return `C(${orderdColor[j].convertedR},${orderdColor[j].convertedG},${orderdColor[j].convertedB})${v}`;
      } else { return ''; }
    }).reverse();

    // 基本のフレーム文法作成
    let frameLP = frame(i, opt.luaCardIndexStartWith, k.join(''));
    let frameSize = bytelen(frame(i, opt.luaCardIndexStartWith, ''));

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
            r.push(frame(i, opt.luaCardIndexStartWith, frameLP));
          }

          if ((bytelen(colorLP) + frameSize) > maxLength) {
            haveColorDiv = true;

            let v_color = colorLP.slice(0, colorLP.indexOf(')') + 1);
            colorLP = colorLP.slice(colorLP.indexOf(')') + 1);
            const localMaxLength = maxLength - frameSize - bytelen(v_color);

            while (bytelen(colorLP) > localMaxLength) {
              let cutpoint = colorLP.lastIndexOf(')', localMaxLength - 1) + 1;
              r.push(frame(i, opt.luaCardIndexStartWith, v_color + colorLP.slice(0, cutpoint)));
              colorLP = colorLP.slice(cutpoint);
            }

            colorLP = v_color + colorLP;
          }
          frameLP = '';
        }
        frameLP += colorLP;
      }
      frameLP = frame(i, opt.luaCardIndexStartWith, frameLP);
    }

    blockLP += frameLP;
  }
  if (blockLP !== '') r.push(blockLP);
  return new FinalLuaCode(r.map((v) => outerFront + v + outerBottom), haveOverRun, haveColorDiv);
}

function defaultFrame(index: number, offset: number, snippet: string) {
  if (snippet.length === 0) {
    return '';
  } else {
    return `\nif I==${index + offset}then ${snippet}end`;
  }
}

function rollFinalize(last: number) {
  return ((index: number, offset: number, snippet: string) => {
    if (snippet.length === 0) {
      return '';
    } else {
      if (index === 0) {
        return `\nif J1(${last})then ${snippet}end`;
      } else {
        return `\nif J(${index + 1})then ${snippet}end`;
      }
    }
  });
}

function bytelen(s: string) {
  return (new Blob([s])).size;
}
import LuaCodeOption from "../LuaCodeOption";
import LuaCodeSnippet from "../LuaCodeSnippet";
import FinalLuaCode from "./FinalLuaCode";

export default function FinalizeLuaCode(sn: Array<LuaCodeSnippet>, opt: LuaCodeOption): FinalLuaCode {
  let ph = {
    offsetX: (opt.offsetX === 0) ? '' : `+${opt.offsetX}`,
    offsetY: (opt.offsetY === 0) ? '' : `+${opt.offsetY}`,
    funcV: (opt.compressV)? '\nfunction V(x,y,h)R(x,y,1,h)end' : '',
    funcH: (opt.compressH)? '\nfunction H(x,y,w)R(x,y,w,1)end' : ''
  }
  let outerFront = `function R(x,y,w,h)S.drawRectF(x${ph.offsetX},y${ph.offsetY},w,h)end${ph.funcV}${ph.funcH}
I=0
function onTick()I=input.getNumber(${opt.readChannel})end
function onDraw()S=screen C=S.setColor`;
  let outerBottom = '\nend';
  let maxLength = 4090 - (bytelen(outerFront) + bytelen(outerBottom));
  let haveOverRun = false;
  let haveColorDiv = false;

  let r: string [] = [];
  let blockLP = '';
  for (let i = 0; i < sn.length; i++) {
    const v = sn[i];
    const k = v.layers.reverse();
    
    let frameLP = frame(i + opt.startWith, k.join(''));
    let frameSize = bytelen(frame(i + opt.startWith, ''));

    if (blockLP !== '' && (bytelen(blockLP) + bytelen(frameLP)) > maxLength) {
      r.push(blockLP);
      blockLP = '';
    }

    if (bytelen(frameLP) > maxLength) {
      haveOverRun = true;
      frameLP = '';
      for (let colorLP of k) {
        if (colorLP === undefined) colorLP = '';
        if ((bytelen(frameLP + colorLP) + frameSize) > maxLength) {
          if (frameLP !== '') {
            r.push(frame(i + opt.startWith, frameLP));
          }

          if ((bytelen(colorLP) + frameSize) > maxLength) {
            haveColorDiv = true;

            let v_color = colorLP.slice(0, colorLP.indexOf(')') + 1);
            colorLP = colorLP.slice(colorLP.indexOf(')') + 1);
            const localMaxLength = maxLength - frameSize - bytelen(v_color);

            while(bytelen(colorLP) > localMaxLength) {
              let cutpoint = colorLP.lastIndexOf(')', localMaxLength - 1) + 1;
              r.push(frame(i + opt.startWith, v_color + colorLP.slice(0, cutpoint)));
              colorLP = colorLP.slice(cutpoint);
            }

            colorLP = v_color + colorLP;
          }
          frameLP = '';
        }
        frameLP += colorLP;
      }
      frameLP = frame(i + opt.startWith, frameLP);
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
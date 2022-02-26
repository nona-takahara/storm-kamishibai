import LuaCodeOption from "../LuaCodeOption";
import LuaCodeSnippet from "../LuaCodeSnippet";

export default function FinalizeLuaCode(sn: Array<LuaCodeSnippet>, opt: LuaCodeOption): string[] {
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

  let r: string [] = [];
  let t = '';
  for (let i = 0; i < sn.length; i++) {
    const v = sn[i];
    const k = v.layers.reverse();
    
    let t2 = frame(i + opt.startWith, k.join(''));

    if (bytelen(t2) > maxLength) {

    }

    if (bytelen(t) + bytelen(t2) > maxLength) {
      r.push(t);
      t = t2;
    } else {
      t += t2;
    }
  }
  if (t !== '') r.push(t);
  return r.map((v) => outerFront + v + outerBottom);
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
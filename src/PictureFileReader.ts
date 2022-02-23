import Lut from './Lut';
import PictureData from './PictureData';

export function fileReadAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    let freader = new FileReader();
    freader.onload = ((evt) => {
      if (evt.target!.result !== null) {
        resolve(evt.target!.result as string);
      } else {
        reject('File data was null');
      }
    });
    freader.readAsDataURL(file);
  });
}

export function imageLoad(imageDataUri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = imageDataUri;

    img.onload = () => { resolve(img); };
    img.onerror = (error) => { reject(error.toString()); };
  });
}

export function u8ImageDataLoad(convert: boolean, imgElement: HTMLImageElement): Promise<PictureData> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas');
    let w = imgElement.naturalWidth, h = imgElement.naturalHeight;
    canvas.width = w;
    canvas.height = h;

    let context = canvas.getContext('2d');
    if (context !== null) {
      context.drawImage(imgElement, 0, 0);
      let res = context.getImageData(0, 0, w, h).data
      if (convert) {
        let k = Lut.map((v) => v);
        k[256] = 256;
        //res = Uint8ClampedArray.from(Array.from(res).map((f, i) => (i%4 === 3) ? f : Lut[Math.max(0, k.findIndex((v) => (Math.floor(f/255*8)/8*255) < v) - 1)]));
        res = Uint8ClampedArray.from(Array.from(res).map((f, i) => (i%4 === 3) ? f : Lut[Math.max(0, k.findIndex((v) => f < v) - 1)]));
      }
      resolve(new PictureData(res, w, h));
    } else {
      reject('Can\'t create canvas context');
    }
  });
}

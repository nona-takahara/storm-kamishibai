import Lut from "./Lut";

type OpenFileInfo = {
  dataUrl: string;
  width: number;
  height: number;
  u8Image: Uint8ClampedArray;
};

export async function fileToU8Image(
  file: File,
  lutFlag: boolean,
): Promise<OpenFileInfo> {
  const dataUrl = await fileReadAsDataURL(file);
  const htmlImg = await imageLoad(dataUrl);
  return {
    dataUrl: dataUrl,
    u8Image: await u8ImageDataLoad(lutFlag, htmlImg),
    width: htmlImg.naturalWidth,
    height: htmlImg.naturalHeight,
  };
}

function fileReadAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const freader = new FileReader();
    freader.onload = (evt) => {
      if (evt.target!.result !== null) {
        resolve(evt.target!.result as string);
      } else {
        reject("File data was null");
      }
    };
    freader.readAsDataURL(file);
  });
}

function imageLoad(imageDataUri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageDataUri;

    img.onload = () => {
      resolve(img);
    };
    img.onerror = (error) => {
      reject(error.toString());
    };
  });
}

function u8ImageDataLoad(
  convert: boolean,
  imgElement: HTMLImageElement,
): Promise<Uint8ClampedArray> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const w = imgElement.naturalWidth,
      h = imgElement.naturalHeight;
    canvas.width = w;
    canvas.height = h;

    const context = canvas.getContext("2d");
    if (context !== null) {
      context.drawImage(imgElement, 0, 0);
      let res = context.getImageData(0, 0, w, h).data;
      if (convert) {
        const k = Lut.map((v) => v);
        k[256] = 256;
        //res = Uint8ClampedArray.from(Array.from(res).map((f, i) => (i%4 === 3) ? f : Lut[Math.max(0, k.findIndex((v) => (Math.floor(f/255*8)/8*255) < v) - 1)]));
        res = Uint8ClampedArray.from(
          Array.from(res).map((f, i) =>
            i % 4 === 3 ? f : Lut[Math.max(0, k.findIndex((v) => f < v) - 1)],
          ),
        );
      }
      resolve(res);
    } else {
      reject("Can't create canvas context");
    }
  });
}

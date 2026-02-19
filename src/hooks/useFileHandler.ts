import { useCallback } from "react";
import { fileToU8Image } from "../PictureFileReader";
import OpenFileCommand from "../worker/OpenFileCommand";
import { useAppStore } from "../store/AppStore";

export const useFileHandler = (postMessageToMain: (command: any, transfer?: Transferable[]) => void) => {
  const {
    setImageUrl,
    setImageWidth,
    setImageHeight,
    setImageLoading,
  } = useAppStore();

  const handleFileChange = useCallback(
    (file: File) => {
      setImageLoading(true);
      fileToU8Image(file, true).then((res) => {
        setImageUrl(res.dataUrl);
        setImageWidth(res.width);
        setImageHeight(res.height);
        const cmd = new OpenFileCommand(
          res.u8Image,
          res.width,
          res.height,
          true,
        );
        postMessageToMain(cmd, cmd.getTransfer());
      });
    },
    [postMessageToMain, setImageUrl, setImageWidth, setImageHeight, setImageLoading],
  );

  return { handleFileChange };
};
import ConvertResultCommand from "./ConvertResultCommand";
import ConvertSucceedCommand from "./ConvertSucceedCommand";
import FileLoadedCommand from "./FileLoadedCommand";
import OpenFileCommand from "./OpenFileCommand";
import StartConvertCommand from "./StartConvertCommand";
import TerminateConverterCommand from "./TerminateConverterCommand";
import ConvertCardCommand from "./ConvertCardCommand";
import EndConvertCommand from "./EndConvertCommand";

export default abstract class WorkerCommand {
  readonly abstract command: string;
  public abstract getTransfer(): Array<Transferable>;
}

export { ConvertResultCommand, ConvertSucceedCommand, FileLoadedCommand, OpenFileCommand, 
StartConvertCommand, TerminateConverterCommand, ConvertCardCommand, EndConvertCommand }
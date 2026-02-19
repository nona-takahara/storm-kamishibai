export default abstract class WorkerCommand {
  abstract readonly command: string;
  public abstract getTransfer(): Array<Transferable>;
}

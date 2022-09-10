export default abstract class WorkerCommand {
  readonly abstract command: string;
  public abstract getTransfer(): Array<Transferable>;
}
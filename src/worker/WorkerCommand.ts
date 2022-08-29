export default abstract class WorkerCommand {
  abstract post(worker: Worker): void;
}

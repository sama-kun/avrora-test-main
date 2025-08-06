export class ProcessTaskCommand {
  constructor(
    public readonly payload: string,
    public readonly taskId: string,
  ) {}
}

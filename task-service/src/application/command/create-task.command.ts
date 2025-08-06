export class CreateTaskCommand {
  constructor(
    public readonly payload: string,
    public readonly priority: number,
  ) {}
}

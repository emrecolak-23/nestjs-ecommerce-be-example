export class PasswordChangedEvent {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly name: string,
    public readonly link: string,
  ) {}
}

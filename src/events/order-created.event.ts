export class OrderCreatedEvent {
  constructor(
    public readonly orderId: number,
    public readonly userId: number,
    public readonly userEmail: string,
    public readonly totalPrice: number,
  ) {}
}

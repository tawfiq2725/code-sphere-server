// Course entity
export class Order {
  constructor(
    public orderId: string,
    public userId: string,
    public courseId: string,
    public totalAmount: string,
    public orderStatus?: "pending" | "success" | "failed",
    public paymentStatus?: "pending" | "success" | "failed",
    public isApplied?: boolean,
    public razorpayOrderId?: string,
    public razorpayPaymentId?: string,
    public razorpaySignature?: string,
    public couponCode?: string,
    public couponDiscount?: string
  ) {}
}

export class Review {
  constructor(
    public rating: number,
    public description: string,
    public hasReview: boolean
  ) {}
}

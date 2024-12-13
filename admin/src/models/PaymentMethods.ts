interface IPaymentMethods {
    id: number;
    type: string;
    createdAt: Date;
    updatedAt: Date
}

class PaymentMethods implements IPaymentMethods {
    id: number;
    type: string;
    createdAt: Date;
    updatedAt: Date
    constructor(id: number, type: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default PaymentMethods
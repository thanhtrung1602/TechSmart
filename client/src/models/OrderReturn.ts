interface OrderReturn {
    total: number;
    bankCode: string;
    responseCode: string;
    order_code: string;
    id: number;
    tracking_order: string;
    createdAt: string;
    transactionCode: number;
}

class OrderReturn implements OrderReturn {
    total: number;
    bankCode: string;
    responseCode: string;
    order_code: string;
    id: number;
    tracking_order: string;
    createdAt: string;
    transactionCode: number;
    constructor(total: number, bankCode: string, responseCode: string, order_code: string, id: number, tracking_order: string, createdAt: string, transactionCode: number) {
        this.total = total;
        this.bankCode = bankCode;
        this.responseCode = responseCode;
        this.order_code = order_code;
        this.id = id;
        this.tracking_order = tracking_order;
        this.createdAt = createdAt;
        this.transactionCode = transactionCode;
    }
}

export default OrderReturn
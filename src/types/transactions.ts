export interface KaspiTransaction {
    id: string;
    order_id: string;
    command: string;
    result: number;
    sum: string;
    comment: string;
    date: string;
    created_at: string;
}

export interface KaspiFastpayTransaction {
    id: string;
    amount_tiyn: number;
    code: number;
    message: string;
    device: number;
    order_id: number;
    created_at: string;
}

export interface EpayTransaction {
    id: string;
    order_id: string;
    approval_code: string;
    card_mask: string;
    card_type: string;
    code: string;
    currency: string;
    date_time: string;
    description: string;
    email: string;
    name: string;
    phone: string;
    reason: string;
    reason_code: string;
    reference: string;
    created_at: string;
}

export interface OrderTransactions {
    order_id: number;
    order_type: "KASPI" | "EPAY";
    kaspi_transactions: KaspiTransaction[];
    kaspi_fastpay_transactions: KaspiFastpayTransaction[];
    epay_transactions: EpayTransaction[];
}


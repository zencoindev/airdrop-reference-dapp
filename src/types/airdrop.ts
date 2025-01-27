export interface UserClaim {
    claim_message: InternalMessage;
    /** @example "597968399" */
    jetton_amount: string;
    /** @example "kQABcHP_oXkYNCx3HHKd4rxL371RRl-O6IwgwqYZ7IT6Ha-u" */
    jetton: string;
}

export interface InternalMessage {
    /**
     * Message sending mode
     * @format int32
     * @example 3
     */
    mode: number;
    /**
     * Destination address in user-friendly form with bounce flag
     * @example "kQABcHP_oXkYNCx3HHKd4rxL371RRl-O6IwgwqYZ7IT6Ha-u"
     */
    address: string;
    /** Message state init (base64 format) */
    state_init?: string;
    /** Message payload (base64 format) */
    payload: string;
    /**
     * TON attached amount
     * @example "597968399"
     */
    amount: string;
}

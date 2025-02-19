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

export const getTxFromUserClaim = (userClaim: UserClaim) => ({
    validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
    messages: [
        {
            address: userClaim.claim_message.address,
            amount: userClaim.claim_message.amount,
            payload: userClaim.claim_message.payload,
            stateInit: userClaim.claim_message.state_init,
        },
    ],
});
// Mapping object to convert numeric error codes to string identifiers
const errorCodeMapping: Record<number, string> = {
    1: 'not_processed',
    2: 'locked',
    3: 'already_claimed',
    4: 'blockchain_overload',
};

// Interfaces for the response
export interface AirdropClaimSuccess {
    success: true;
    claim: UserClaim;
}

export interface AirdropClaimError {
    success: false;
    error: {
        code: string;
        message: string;
    };
}

export type AirdropClaimResponse = AirdropClaimSuccess | AirdropClaimError;

/**
 * Handles HTTP errors (e.g., 400, 404, 500) by mapping them to generic,
 * user-friendly error messages so that no sensitive network information is leaked.
 *
 * @param response - The original fetch Response object.
 * @param data - Parsed JSON data from the response body.
 * @returns An AirdropClaimError with a generic error code and message.
 */
const handleHttpError = (
    response: Response,
    data: { code?: number | string; message?: string }
): AirdropClaimError => {
    let code: string;
    let message: string;

    if (response.status === 400) {
        code = 'bad_request';
        message = data?.message || 'Invalid Airdrop ID or recipient address.';
    } else if (response.status === 404) {
        code = 'not_found';
        message = data?.message || 'Entity not found.';
    } else if (response.status === 500) {
        code = 'internal_error';
        message = data?.message || 'Internal server error.';
    } else {
        // For other status codes, try to map the error using the response body.
        const rawCode = data?.code;
        if (typeof rawCode === 'number') {
            code =
                errorCodeMapping[rawCode as keyof typeof errorCodeMapping] ||
                rawCode.toString();
            message =
                typeof data?.message === 'string'
                    ? data.message
                    : response.statusText || 'Unknown error';
        } else {
            code = data?.code
                ? data.code.toString()
                : response.status.toString();
            message = data?.message || response.statusText || 'Unknown error';
        }
    }

    return {
        success: false,
        error: { code, message },
    };
};

/**
 * Function to request an airdrop claim.
 * Processes responses by mapping numeric error codes to string identifiers,
 * ensuring the error.code field is always a string, and handling HTTP errors (400, 404, 500)
 * so that no sensitive network information is exposed.
 *
 * @param airdropId - The Airdrop identifier.
 * @param connectedAddress - The recipient's wallet address.
 * @param testnet - Flag indicating if the request should be made against the testnet (default false).
 * @returns A promise that resolves to an AirdropClaimResponse.
 */
export const fetchAirdropClaim = (
    airdropId: string,
    connectedAddress: string,
    testnet: boolean = false
): Promise<AirdropClaimResponse> => {
    const baseUrl = `${testnet ? 'testnet' : 'mainnet'}-airdrop.tonapi.io`;
    const url = `https://${baseUrl}/v1/airdrop/claim/${connectedAddress}?id=${airdropId}`;

    return fetch(url)
        .then((response) =>
            response.json().then((data) => ({ response, data }))
        )
        .then(({ response, data }) => {
            if (!response.ok) {
                // Process HTTP errors (400, 404, 500, etc.) at this level.
                return handleHttpError(response, data);
            }

            // Successful response returns a claim.
            return {
                success: true,
                claim: data as UserClaim,
            } as AirdropClaimSuccess;
        })
        .catch(() => ({
            // Catch-all for network or unexpected errors.
            success: false,
            error: {
                code: 'network_error',
                message: 'Network error. Please try again later.',
            },
        }));
};

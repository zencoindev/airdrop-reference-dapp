import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { TonApiClient } from '@ton-api/client';
import { Address } from '@ton/core';

import './App.css';
import { List } from './components/List/List';
import { Loader } from './components/Loader/Loader';
import { showConfetti } from './utils/confetti';
import { JettonInfo } from '@ton-api/client';
import { toDecimals } from './utils/decimals';
import { prepareVestingRenderData, getNextClaimDate, formatDateWithTime } from './utils/vesting';

export interface VestingParameters {
    unlocks_list: UnlockData[];
}

export interface UnlockData {
    /** Unlock unixutime */
    unlock_time: number;
    /**
     * The percentage rounded to the second decimal place multiplied by 100.
     * Example: 25.15% -> 2515
     * @minimum 0
     * @maximum 10000
     */
    fraction: number;
}

export interface UserClaimInfo {
    /** Jetton master contract in user-friendly form
     * @example "kQABcHP_oXkYNCx3HHKd4rxL371RRl-O6IwgwqYZ7IT6Ha-u"
     */
    jetton: string;
    /** Jetton amount available for claim now
     * @example "597968399"
     */
    available_jetton_amount: string;
    /** Total Jetton amount for airdrop
     * @example "597968399"
     */
    total_jetton_amount: string;
    /** Already claimed Jetton amount
     * @example "597968399"
     */
    claimed_jetton_amount: string;
    /** Optional vesting parameters if applicable */
    vesting_parameters?: VestingParameters;
}

export interface UserClaim extends UserClaimInfo {
    /** Message to be sent to claim tokens */
    claim_message: InternalMessage;
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

/**
 * Creates a transaction object from a UserClaim
 * @param userClaim - The claim data containing message details
 * @returns A transaction object with a 5-minute validity period
 */
const getTxFromUserClaim = (message: InternalMessage) => ({
    validUntil: Math.floor(Date.now() / 1000) + 5 * 60, // 5 minutes
    messages: [
        {
            address: message.address,
            amount: message.amount,
            payload: message.payload,
            stateInit: message.state_init,
        },
    ],
});

// Response interfaces
export interface AirdropClaimSuccess {
    success: true;
    info: UserClaimInfo;
    claim: InternalMessage;
}

export interface AirdropClaimError {
    success: false;
    info?: UserClaimInfo;
    errorCode: number;
}

export type AirdropClaimResponse = AirdropClaimSuccess | AirdropClaimError;

/**
 * Custom hook to get URL query parameters.
 */
function useQuery() {
    return useMemo(() => new URLSearchParams(window.location.search), []);
}

const errorMessages: Record<string, string> = {
    425: 'The nearest vesting date has not arrived yet',
    409: 'All Jettons have already been claimed', // Check
    423: 'Airdrop is locked by admin',
    429: 'Blockchain is currently overloaded',
    404: 'Airdrop not found or not processed yet',
    500: 'Internal server error',
    [-1]: 'Something went wrong. Please try again later',
};

function App() {
    // Extract airdropId from query params or environment variable.
    const query = useQuery();
    const airdropId =
        import.meta.env.VITE_AIRDROP_UUID ?? query.get('airdropId');
    const previewJetton =
        import.meta.env.VITE_AIRDROP_JETTON ?? query.get('jettonAddress');
    const testnet = query.get('testnet') === 'true';

    // Create a new TonApiClient instance with the appropriate base URL.
    const ta = useMemo(
        () =>
            new TonApiClient({
                baseUrl: `https://${testnet ? 'testnet.' : ''}tonapi.io`,
            }),
        [testnet]
    );

    // Get the connected wallet address and TonConnect UI instance.
    const connectedAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    // States for claim data, jetton info, error messages, and loading status.
    const [isClaimInfoLoading, setIsClaimInfoLoading] = useState(true);
    const [userClaimInfo, setUserClaimInfo] = useState<UserClaimInfo | null>(
        null
    );
    const [userClaimMessage, setUserClaimMessage] =
        useState<InternalMessage | null>(null);
    const [claimError, setClaimError] = useState<number | null>(null);
    const [jettonAddress, setJettonAddress] = useState<string | null>(
        previewJetton
    );
    const [jettonInfo, setJettonInfo] = useState<JettonInfo | null>(null);
    const [isClaiming, setIsClaiming] = useState(false);

    /**
     * Ensures the wallet connection is active.
     */
    useEffect(() => {
        setTimeout(() => {
            tonConnectUI.connectionRestored.then((connected) => {
                if (!connected) {
                    tonConnectUI.openModal();
                    setIsClaimInfoLoading(false);
                }
            });
        }, 300);
    }, [tonConnectUI]);

    /**
     * Fetch the airdrop claim.
     * This effect processes all possible outcomes from fetchAirdropClaim,
     * including HTTP errors (400, 404, 500) and network issues.
     */
    useEffect(() => {
        if (!connectedAddress) {
            return;
        }

        setIsClaimInfoLoading(true);
        setClaimError(null);
        setUserClaimInfo(null);
        setUserClaimMessage(null);
        setJettonInfo(null);
        setJettonAddress(previewJetton);    
        setIsClaiming(false);

        const baseUrl = `${testnet ? 'testnet' : 'mainnet'}-airdrop.tonapi.io`;
        // const baseUrl = `demo-airdrop.tonapi.io`;
        const url = `https://${baseUrl}/v2/airdrop/claim/${connectedAddress}?id=${airdropId}`;

        fetch(url)
            .then(async (response) => ({
                status: response.status,
                data: await response.json(),
            }))
            .then(({ status, data }) => {
                const { claim_message, ...info } = data as UserClaim;
                setUserClaimInfo(info);

                if (status === 200) {
                    setUserClaimMessage(claim_message);
                } else {
                    setClaimError(status);
                }
            })
            .catch(() => {
                setClaimError(-1);
            })
            .finally(() => {
                setIsClaimInfoLoading(false);
            });
    }, [connectedAddress, airdropId, testnet, previewJetton]);

    // If the jetton address is provided, set it as the current jetton.
    useEffect(() => {
        setJettonAddress(userClaimInfo?.jetton ?? null);
    }, [userClaimInfo]);

    /**
     * Fetch jetton info once the jetton address is available.
     */
    useEffect(() => {
        if (!jettonAddress) return;

        ta.jettons
            .getJettonInfo(Address.parse(jettonAddress))
            .then(setJettonInfo)
            .catch((error) => {
                console.error('Failed to fetch jetton info:', error);
            });
    }, [jettonAddress, ta]);


    // If no wallet is connected, instruct the user to connect their wallet.
    if (!connectedAddress) {
        return (
            <div className="mw60 flex flex-column">
                <div className="padding-top" />
                {jettonInfo && (
                    <img
                        alt={jettonInfo.metadata.name}
                        className="jetton-logo"
                        src={jettonInfo.preview}
                    />
                )}
                <h2><b>Airdrop</b> is complete</h2>
                <h3>Season 2 is coming...</h3>
            </div>
        );
    }

    // Render the main UI if claim data is successfully loaded.
    return (
        <div className="mw60 flex flex-column">
            <div className="padding-top" />
            {jettonInfo && (
                <img
                    alt={jettonInfo.metadata.name}
                    className="jetton-logo"
                    src={jettonInfo.preview}
                />
            )}
            <h2><b>Airdrop</b> is complete</h2>
            <h3>Season 2 is coming...</h3>
        </div>
    );
}

export default App;

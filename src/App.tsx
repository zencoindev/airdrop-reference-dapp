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
import {
    getTxFromUserClaim,
    UserClaim,
    fetchAirdropClaim,
} from './utils/airdrop';

/**
 * Custom hook to get URL query parameters.
 */
function useQuery() {
    return useMemo(() => new URLSearchParams(window.location.search), []);
}

const errorMessages: Record<string, string> = {
    bad_request: 'Invalid Airdrop ID or recipient address.',
    not_found: 'Airdrop or recipient not found.',
    internal_error: 'Internal server error. Please try again later.',
    not_processed: 'Airdrop data is not processed yet. Please try again later.',
    locked: 'Airdrop claim is currently disabled.',
    already_claimed: 'You have already claimed your token.',
    blockchain_overload:
        'Blockchain is overloaded. Claim is temporarily suspended.',
    network_error: 'Network error. Please check your connection and try again.',
};

function App() {
    // Extract airdropId from query params or environment variable.
    const query = useQuery();
    const airdropId = import.meta.env.VITE_AIRDROP_UUID ?? query.get('airdropId');
    const previewJetton = import.meta.env.VITE_AIRDROP_JETTON ?? query.get('jettonAddress');
    const testnet = query.get('testnet') === 'true';

    // Create a new TonApiClient instance with the appropriate base URL.
    const ta = useMemo(() => new TonApiClient({
        baseUrl: `https://${testnet ? 'testnet.' : ''}tonapi.io`,
    }), [testnet] );

    // Get the connected wallet address and TonConnect UI instance.
    const connectedAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    // States for claim data, jetton info, error messages, and loading status.
    const [isClaimDataLoading, setIsClaimDataLoading] = useState(true);
    const [userClaim, setUserClaim] = useState<UserClaim | null>(null);
    const [claimError, setClaimError] = useState<string | null>(null);
    const [jettonAddress, setJettonAddress] = useState<string | null>(previewJetton);
    const [jettonInfo, setJettonInfo] = useState<JettonInfo | null>(null);
    const [isClaiming, setIsClaiming] = useState(false);

    /**
     * Ensures the wallet connection is active.
     */
    useEffect(() => {
        setTimeout(() => {
            tonConnectUI.connectionRestored.then((connected) => {
                if (!connected) { tonConnectUI.openModal() }});
        }, 300);
    }, [tonConnectUI]);

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

    /**
     * Fetch the airdrop claim.
     * This effect processes all possible outcomes from fetchAirdropClaim,
     * including HTTP errors (400, 404, 500) and network issues.
     */
    useEffect(() => {
        if (!connectedAddress) {
            return;
        }

        fetchAirdropClaim(airdropId, connectedAddress, testnet)
            .then((result) => {
                if (result.success) {
                    setUserClaim(result.claim);
                    setJettonAddress(result.claim.jetton);
                    setClaimError(null);
                } else {
                    // Map error codes to user-friendly messages.
                    const message =
                        errorMessages[result.error.code] ||
                        'An unknown error occurred.';

                    setClaimError(message);
                    setUserClaim(null);
                    setJettonAddress(null);
                }
            })
            .catch(() => {
                setClaimError('Unexpected error occurred.');
                setUserClaim(null);
                setJettonAddress(null);
            })
            .finally(() => {
                setIsClaimDataLoading(false);
            });
    }, [connectedAddress, airdropId, testnet]);

    /**
     * Handles sending the airdrop claim transaction.
     */
    const handleSendMessage = useCallback(() => {
        if (!userClaim) return;
        const tx = getTxFromUserClaim(userClaim);
        tonConnectUI.sendTransaction(tx).then(() => {
            setIsClaiming(true);
            showConfetti();
        });
    }, [userClaim, tonConnectUI]);

    // If no Airdrop ID is provided, show an early error message.
    if (!airdropId) {
        return (
            <div className="placeholder">
                <div className="body1 secondary">
                    Airdrop ID is not provided.
                </div>
            </div>
        );
    }

    // While claim data is loading, show the loader.
    if (isClaimDataLoading) {
        return (
            <div className="placeholder">
                <Loader />
            </div>
        );
    }

    // If no wallet is connected, instruct the user to connect their wallet.
    if (!connectedAddress) {
        return (
            <div className="placeholder">
                <div className="body1 secondary">
                    Please connect your wallet to claim the token.
                </div>
            </div>
        );
    }

    // If an error occurred during claim fetching, display the error message.
    if (claimError) {
        return (
            <div className="placeholder">
                <div className="body1 secondary">{claimError}</div>
            </div>
        );
    }

    // Case that should never happen: no claim data or jetton info.
    if (!userClaim || !jettonInfo) {
        return (
            <div className="placeholder">
                <div className="body1 secondary">No claim data available.</div>
            </div>
        );
    }

    // Render the main UI if claim data is successfully loaded.
    return (
        <div className="mw60">
            <div className="padding-top" />
            {jettonInfo && (
                <img
                    alt={jettonInfo.metadata.name}
                    className="jetton-logo"
                    src={jettonInfo.preview}
                />
            )}
            <div className="desc-container mb32">
                <h2>Claim your token</h2>
            </div>
            <List>
                <List.Item title="Amount">
                    {toDecimals(
                        userClaim.jetton_amount,
                        jettonInfo?.metadata.decimals ?? 9
                    )}{' '}
                    {jettonInfo?.metadata.symbol}
                </List.Item>
                <List.Item title="To be paid">
                    ~{toDecimals(userClaim.claim_message.amount, 9)} TON
                </List.Item>
            </List>
            <div className="end-page">
                <div className="mw60">
                    <button
                        disabled={isClaiming}
                        className="button primary"
                        onClick={handleSendMessage}
                    >
                        <div className="label1">Claim!</div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;

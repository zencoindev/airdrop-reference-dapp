import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';

import './App.css';
import { List } from './components/List/List';
import { Loader } from './components/Loader/Loader';
import { claimAPI } from './api';
import { UserClaim } from './api/claimAPI';
import { isValidAddress } from './utils/address';
import { showConfetti } from './utils/confetti';
import tonapi from './tonapi';
import { JettonInfo } from '@ton-api/client';
import { fromNano } from './utils/decimals';

BigInt.prototype.toJSON = function () {
    return this.toString();
};

function useQuery() {
    return useMemo(
        () => new URLSearchParams(window.location.search),
        [window.location.search]
    );
}

function App() {
    const query = useQuery();
    const [isClaimStatusLoading, setClaimStatusLoading] = useState(true);
    const [userClaim, setUserClaim] = useState<UserClaim | null>(null);
    const [jettonInfo, setJettonInfo] = useState<JettonInfo | null>(null);
    const [isClaiming, setIsClaiming] = useState(false);

    const [tonConnectUI] = useTonConnectUI();

    const claimId = query.get('claimId') ?? import.meta.env.VITE_CLAIM_UUID;
    const claimJettonAddress =
        query.get('claimJetton') ?? import.meta.env.VITE_CLAIM_TOKEN_ADDRESS;

    const connectedAddressString = useTonAddress();
    const connectedAddress = useMemo(() => {
        return isValidAddress(connectedAddressString)
            ? Address.parse(connectedAddressString)
            : null;
    }, [connectedAddressString]);

    useEffect(() => {
        setTimeout(() => {
            tonConnectUI.connectionRestored.then((connected) => {
                if (!connected) {
                    tonConnectUI.openModal();
                }
            });
        }, 400);
    }, [tonConnectUI]);

    useEffect(() => {
        async function loadJettonInfo() {
            const storageKey = `jetton_${claimJettonAddress}`;
            const storedInfo = localStorage.getItem(storageKey);
            if (storedInfo) {
                setJettonInfo(JSON.parse(storedInfo));
                return;
            }
            const jettonInfo = await tonapi.jettons.getJettonInfo(
                Address.parse(claimJettonAddress)
            );
            setJettonInfo(jettonInfo);
            localStorage.setItem(storageKey, JSON.stringify(jettonInfo));
        }

        loadJettonInfo();
    }, []);

    useEffect(() => {
        if (connectedAddress) {
            claimAPI.airdrop
                .getUserClaim({
                    account: connectedAddress.toRawString(),
                    id: claimId,
                })
                .then((userClaim) => {
                    setClaimStatusLoading(false);
                    setUserClaim(userClaim);
                })
                .catch(() => {
                    setClaimStatusLoading(false);
                    setUserClaim(null);
                });
        } else {
            setClaimStatusLoading(false);
            setUserClaim(null);
        }
    }, [connectedAddress]);

    const handleSendMessage = useCallback(() => {
        const claimMessage = userClaim?.claim_message;
        if (!claimMessage) {
            return;
        }
        tonConnectUI
            .sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [
                    {
                        address: claimMessage.address,
                        amount: claimMessage.amount,
                        payload: claimMessage.payload,
                        stateInit: claimMessage.state_init,
                    },
                ],
            })
            .then(() => {
                setIsClaiming(true);
                showConfetti();
            });
    }, [tonConnectUI, userClaim?.claim_message]);

    if (!claimId || !claimJettonAddress) {
        return (
            <div className="placeholder">
                <div className="body1 secondary">
                    Claim ID or Jetton address is not provided.
                </div>
            </div>
        );
    }

    if (isClaimStatusLoading) {
        return (
            <div className="placeholder">
                <Loader />
            </div>
        );
    }

    if (!connectedAddress) {
        return (
            <div className="placeholder">
                <div className="body1 secondary">
                    Please connect your wallet to claim the token.
                </div>
            </div>
        );
    }

    if (!userClaim?.amount) {
        return (
            <div className="placeholder">
                <div className="body1 secondary">
                    You have no tokens available for claim.
                </div>
            </div>
        );
    }

    return (
        <div className={'mw60'}>
            <div className={'padding-top'} />
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
                <List.Item title={'Amount'}>
                    {fromNano(
                        userClaim.amount,
                        jettonInfo?.metadata.decimals ?? 9
                    )}{' '}
                    {jettonInfo?.metadata.symbol}
                </List.Item>
                <List.Item title={'To be paid'}>
                    ~{fromNano(userClaim.claim_message.amount)} TON
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

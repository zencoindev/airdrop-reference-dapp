import {useCallback, useEffect, useMemo, useState} from "react";

import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";

import "./App.css";
import { List } from "./components/List/List.tsx";
import { Loader } from "./components/Loader/Loader.tsx";
import { claimAPI } from "./api";
import { UserClaim } from "./api/claimAPI.ts";
import { isValidAddress } from "./utils/address.ts";
import { showConfetti } from "./utils/confetti.ts";

function App() {
  const [isClaimStatusLoading, setClaimStatusLoading] = useState(true);
  const [userClaim, setUserClaim] = useState<UserClaim | null>(null);

  const [tonConnectUI] = useTonConnectUI();

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
    if (connectedAddress) {
      claimAPI.airdrop.getUserClaim({ account: connectedAddress.toRawString(), id: "1f94c970-4b76-42b8-8372-5ec11029d8e1" }).then(userClaim => {
        setClaimStatusLoading(false);
        setUserClaim(userClaim);
      }).catch(() => {
        setClaimStatusLoading(false);
        setUserClaim(null);
      })
    }
  }, [connectedAddress]);

  const handleSendMessage = useCallback(() => {
    const claimMessage = userClaim?.claim_message;
    if (!claimMessage) {
      return;
    }
    tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 300,
      messages: [
        {
          address: claimMessage.address,
          amount: claimMessage.amount,
          payload: claimMessage.payload,
          stateInit: claimMessage.state_init,
        }
      ],
    }).then(() => {
      showConfetti();
    });

  }, [tonConnectUI, userClaim?.claim_message]);

  if (isClaimStatusLoading) {
    return (
      <div className="placeholder">
        <Loader />
      </div>
    );
  }

  if (!userClaim?.amount) {
    return (
      <div className="placeholder">
        <div className="body1 secondary">You have no tokens available for claim.</div>
      </div>
    );
  }

  return (
    <>
      <div className={"padding-top"} />
      <div className="desc-container mb32">
        <h2>Claim your token</h2>
      </div>
      <List>
        <List.Item title={"Amount"}>
          {userClaim.amount}
        </List.Item>
      </List>
      <div className="end-page">
        <button className="button primary" onClick={handleSendMessage}><div className="label1">Claim!</div></button>
      </div>
    </>
  );
}

export default App;

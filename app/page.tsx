"use client";

import { useState, useEffect } from "react";
import { AppConfig, UserSession, showConnect, openContractCall } from "@stacks/connect";
import { StacksTestnet, StacksMainnet } from "@stacks/network";
// SỬA LỖI 1: Đổi uint -> uintCV, stringUtf8 -> stringUtf8CV
import { uintCV, stringUtf8CV } from "@stacks/transactions";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [txId, setTxId] = useState("");
  const [networkType, setNetworkType] = useState("mainnet"); // Switch to 'mainnet' if deploying to mainnet

  // ⚠️ CRITICAL CONFIGURATION: REPLACE THIS WITH YOUR DEPLOYED CONTRACT ADDRESS
  const CONTRACT_ADDRESS = "SPHMWZQ1KW03KHYPADC81Q6XXS284S7QCHRAS3A8"; 
  const CONTRACT_NAME = "time-vault";

  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });

  useEffect(() => {
    setMounted(true);
    if (userSession.isUserSignedIn()) {
      // Get the wallet address corresponding to the selected network
      const userData = userSession.loadUserData();
      setUser(networkType === "mainnet" ? userData.profile.stxAddress.mainnet : userData.profile.stxAddress.testnet);
    }
  }, [networkType]);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: "Time Capsule Universal",
        icon: window.location.origin + "/favicon.ico",
      },
      redirectTo: "/",
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut("/");
    setUser(null);
  };

  const createCapsule = async () => {
    if (!user) return;
    setStatus("⏳ Fetching current block info...");

    try {
      // 1. Determine API URL based on network
      const apiUrl = networkType === "mainnet" 
        ? "https://api.hiro.so" 
        : "https://api.testnet.hiro.so";
        
      // 2. Fetch current Block Height from API
      const response = await fetch(`${apiUrl}/v2/info`);
      const data = await response.json();
      const currentBlock = data.burn_block_height;

      // 3. Calculate unlock height (Lock for +2 blocks ~ approx 20 mins)
      const unlockHeight = currentBlock + 2;

      setStatus(`🔒 Sending lock transaction for block #${unlockHeight}...`);

      // 4. Select the appropriate Stacks network
      const network = networkType === "mainnet" ? new StacksMainnet() : new StacksTestnet();

      // 5. Call Smart Contract
      await openContractCall({
        network,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "create-capsule",
        functionArgs: [
          // SỬA LỖI 2: Dùng uintCV và stringUtf8CV
          uintCV(unlockHeight),          // Arg 1: Unlock Block Height
          uintCV(1000000),               // Arg 2: Amount (1 STX)
          stringUtf8CV("Universal Code") // Arg 3: Message
        ],
        onFinish: (data) => {
          setTxId(data.txId);
          setStatus("✅ Transaction broadcasted successfully!");
        },
        onCancel: () => {
          setStatus("❌ Transaction canceled.");
        },
      });
    } catch (err) {
      console.error(err);
      setStatus("❌ Error connecting to network.");
    }
  };

  // Prevent hydration errors by ensuring component is mounted
  if (!mounted) return null;

  return (
    <main style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      fontFamily: "sans-serif",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{ 
        backgroundColor: "white", 
        padding: "40px", 
        borderRadius: "16px", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
        maxWidth: "500px", 
        width: "100%",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: "24px", color: "#333" }}>⏳ Time Capsule</h1>
        
        {!user ? (
          <button 
            onClick={connectWallet}
            style={{ 
              padding: "14px 28px", 
              fontSize: "16px", 
              fontWeight: "bold",
              cursor: "pointer", 
              backgroundColor: "#121212", 
              color: "white", 
              border: "none", 
              borderRadius: "8px",
              width: "100%"
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "8px", fontSize: "14px" }}>
              Logged in as: <strong>{user.slice(0, 6)}...{user.slice(-4)}</strong>
              <br/>
              <button 
                onClick={disconnect}
                style={{ marginTop: "10px", padding: "4px 10px", fontSize: "12px", cursor: "pointer" }}
              >
                Sign Out
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ marginRight: "10px" }}>Network:</label>
              <select 
                value={networkType} 
                onChange={(e) => setNetworkType(e.target.value)}
                style={{ padding: "5px" }}
              >
                <option value="testnet">Testnet</option>
                <option value="mainnet">Mainnet</option>
              </select>
            </div>

            <button 
              onClick={createCapsule}
              style={{ 
                padding: "16px 32px", 
                fontSize: "18px", 
                fontWeight: "bold",
                cursor: "pointer", 
                backgroundColor: "#5546FF", 
                color: "white", 
                border: "none", 
                borderRadius: "12px",
                width: "100%",
                boxShadow: "0 4px 6px rgba(85, 70, 255, 0.2)"
              }}
            >
              🔒 Lock 1 STX (2 Blocks)
            </button>

            {status && (
              <p style={{ marginTop: "20px", color: status.includes("❌") ? "red" : "#5546FF" }}>
                {status}
              </p>
            )}
            
            {txId && (
              <div style={{ marginTop: "20px", wordBreak: "break-all" }}>
                <a 
                  href={`https://explorer.hiro.so/txid/${txId}?chain=${networkType}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: "#5546FF", textDecoration: "underline" }}
                >
                  View Transaction on Explorer ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
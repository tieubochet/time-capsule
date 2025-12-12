# ⏳ Stacks Time Capsule

![Stacks](https://img.shields.io/badge/Stacks-Blockchain-purple?style=for-the-badge)
![Clarity](https://img.shields.io/badge/Clarity-Smart_Contract-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📖 About The Project

**Stacks Time Capsule** is a decentralized application (dApp) that allows users to lock their STX tokens on the Stacks blockchain for a specified period. The tokens remain securely locked in a smart contract until the target block height is reached, ensuring a trustless "savings" mechanism secured by Bitcoin.

This project was built as part of the **Stacks Builder Challenge**.

### 🌟 Key Features
* **Time-Locking:** Users can deposit STX and set a future block height for unlocking.
* **Block-Based Logic:** Utilizes `burn-block-height` for immutable, Bitcoin-anchored time verification.
* **Web3 Integration:** Seamless wallet connection using Leather/Xverse via `@stacks/connect`.
* **Real-time Status:** Fetches live network data to calculate accurate lock durations.

---

## 🏆 Stacks Builder Challenge Highlights

This repository demonstrates proficiency in the Stacks ecosystem:

* **Smart Contract Deployment:** Successfully deployed and interacting on the Stacks Testnet/Mainnet.
* **Stacks.js Integration:**
    * `@stacks/connect`: Used for user authentication and transaction signing.
    * `@stacks/network` & `@stacks/transactions`: Used for broadcasting contract calls and data encoding.
* **Universal Compatibility:** The contract is optimized with a "Universal" logic (Clarity 2 compatible) to ensure 100% uptime and interaction capability on the current mainnet epoch, while being ready for Clarity 4 upgrades.

---

## 🛠️ Tech Stack

* **Smart Contract:** Clarity (deployed via Hiro Platform/Clarinet).
* **Frontend:** Next.js (React), TypeScript.
* **Styling:** CSS Modules / Inline Styles.
* **Integration:** Stacks.js SDK.
* **Deployment:** Vercel.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* A Stacks Wallet (Leather or Xverse)
* Mainnet STX 

### Installation

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/tieubochet/time-capsule.git](https://github.com/tieubochet/time-capsule.git)
    cd time-capsule
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run local server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📜 Smart Contract Details

* **Contract Address (Mainnet):** `[SPHMWZQ1KW03KHYPADC81Q6XXS284S7QCHRAS3A8.time-vault]`
* **Contract Name:** `time-vault`

**Core Logic Snippet:**
```clarity
(define-public (create-capsule (unlock-height uint) (amount uint) (message (string-utf8 256)))
    (let ((current-height burn-block-height))
        (asserts! (> unlock-height current-height) (err u101))
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        ;; ... logic to save capsule
        (ok "Capsule Created")
    )
)

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

📄 License
Distributed under the MIT License. See LICENSE for more information.

Built with ❤️ for the Stacks Ecosystem.
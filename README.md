# Financial Time Machine (Hackathon MVP)

A Next.js + MongoDB + Plaid Sandbox app to replay transaction timelines and create branching financial scenarios (Git-style).

## 1) Project Structure

```text
.
├─ app/
│  ├─ api/
│  │  ├─ plaid/
│  │  │  ├─ create_link_token/route.js
│  │  │  ├─ exchange_public_token/route.js
│  │  │  └─ sync/route.js
│  │  ├─ branches/
│  │  │  ├─ [id]/route.js
│  │  │  └─ route.js
│  │  └─ simulate/route.js
│  ├─ dashboard/page.js
│  ├─ globals.css
│  ├─ layout.js
│  └─ page.js
├─ components/
│  ├─ BalanceChart.js
│  ├─ BranchTree.js
│  ├─ ComparisonPanel.js
│  ├─ ScenarioModal.js
│  └─ TransactionTimeline.js
├─ lib/
│  ├─ db.js
│  ├─ demoData.js
│  ├─ normalize.js
│  ├─ plaid.js
│  ├─ simulate.js
│  └─ models/
│     ├─ Account.js
│     ├─ Branch.js
│     ├─ PlaidItem.js
│     └─ Transaction.js
├─ .env.example
├─ .gitignore
├─ jsconfig.json
├─ next.config.js
├─ package.json
├─ postcss.config.js
└─ tailwind.config.js
```

## 2) Setup

1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env.local
```

3. Fill Plaid + Mongo variables in `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/financial-time-machine
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox
PLAID_PRODUCTS=transactions
PLAID_COUNTRY_CODES=US
PLAID_REDIRECT_URI=
DEMO_USER_ID=demo-user-001
LOW_BALANCE_THRESHOLD=100
```

4. Run MongoDB (local or Atlas).

5. Start the app:
```bash
npm run dev
```

6. Open:
- `http://localhost:3000/` landing
- `http://localhost:3000/dashboard?mode=demo` demo mode
- `http://localhost:3000/dashboard?mode=plaid` plaid mode

## 3) Plaid Sandbox Quick Notes

1. Create a Plaid dev account.
2. Get `client_id` + `sandbox secret`.
3. Set `PLAID_ENV=sandbox`.
4. Use `/dashboard?mode=plaid`.
5. Click **Connect Plaid Sandbox**, complete Link flow, then click **Sync**.

If Plaid keys are missing, app automatically falls back to demo transactions.

## 4) MVP Features Implemented

- Plaid routes:
  - `POST /api/plaid/create_link_token`
  - `POST /api/plaid/exchange_public_token`
  - `POST /api/plaid/sync`
- Branch routes:
  - `GET /api/branches`
  - `POST /api/branches`
  - `GET /api/branches/:id`
- Simulation route:
  - `POST /api/simulate`
- Mongoose models:
  - `PlaidItem`, `Account`, `Transaction`, `Branch`
- UI:
  - Vertical transaction timeline + scrubber
  - Branch tree (Git-like nodes)
  - Balance chart (Recharts)
  - Scenario modal for insert/edit
  - Comparison panel baseline vs selected branch
- Demo mode fallback dataset
- Disclaimer in UI: Simulation only - not financial advice

## 5) Simulation Engine

- Pure function in `lib/simulate.js`
- Supports scenarios:
  - `remove_transaction`
  - `insert_transaction`
  - `edit_transaction`
- Outputs:
  - `metrics`
  - `dailyBalances`
  - `transactionTimeline`
- Includes unit-test style usage examples in file comments.



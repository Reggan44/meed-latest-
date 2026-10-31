# Meed Collections (`meedcollections.store`) - Master Launch Plan & Task Tracker

This document tracks every task from start to finish to take `meedcollections.store` to live production.

---

## 📊 High-Level Status Overview

| Phase | Description | Status | Owner |
|---|---|---|---|
| **Phase 1** | Go Live with IntaSend (Credentials, Webhook, Live Test) | 🟡 Awaiting Your Live Keys in Vercel | You |
| **Phase 2** | Fix Correctness Gaps (Stock, Sales, Cart, Order Retry) | ✅ Completed & Verified | Agent |
| **Phase 3** | Transactional Emails via Resend (Domain, Reset, Order Emails) | 🟡 Code Ready (Domain DNS in Resend) | You & Agent |
| **Phase 4** | Launch Polish (Hydration, Mobile Layout, Security, SEO, 404) | ✅ Completed & Verified | Agent |

---

## 📋 Detailed Task-by-Task Roadmap

### 🟡 Phase 1: Go Live with IntaSend

- [ ] **Task 1.1: Retrieve Live IntaSend API Keys** *(Owner: You)*
  - Go to `https://payment.intasend.com` → Settings → API Keys.
  - Copy Live Publishable Key and Live Secret Key.
- [ ] **Task 1.2: Set Vercel Production Environment Variables** *(Owner: You)*
  - `INTASEND_PUBLISHABLE_KEY` = `<your-live-publishable-key>`
  - `INTASEND_SECRET_KEY` = `<your-live-secret-key>`
  - `INTASEND_TEST_MODE` = `false`
  - `INTASEND_WEBHOOK_CHALLENGE` = `<random-secret-string>`
  - `NEXTAUTH_URL` = `https://meedcollections.store`
  - `NEXT_PUBLIC_BASE_URL` = `https://meedcollections.store`
  - `NEXTAUTH_SECRET` = `<nextauth-secret>`
- [ ] **Task 1.3: Configure IntaSend Live Webhook** *(Owner: You)*
  - Add webhook URL: `https://meedcollections.store/api/payments/intasend/webhook`
  - Set challenge to match `INTASEND_WEBHOOK_CHALLENGE`.
- [x] **Task 1.4: Codebase Verification for Live Endpoints** *(Owner: Agent)*
  - Confirmed `lib/intasend.js` points to `https://payment.intasend.com` when `INTASEND_TEST_MODE=false`.
  - Confirmed webhook payload handling (`api_ref`, `invoice_id`, `challenge`).
- [ ] **Task 1.5: End-to-End Live Payment Test** *(Owner: You & Agent)*
  - Complete a real M-Pesa transaction (KSh 10 - KSh 50) on `meedcollections.store`.
  - Confirm the order transitions from `PENDING` to `PAID`.

---

### ✅ Phase 2: Fix Correctness Gaps & Business Logic

- [x] **Task 2.1: Enforce Stock Validation at Order Creation** *(Owner: Agent)*
  - File: `app/api/orders/route.js`
  - Action: Validates each item's requested quantity against `product.productStock`.
  - Result: Prevents placing orders for out-of-stock items or quantities greater than inventory.
- [x] **Task 2.2: Decrement Stock Atomically Upon Payment Confirmation** *(Owner: Agent)*
  - File: `lib/payments.js`
  - Action: In `syncOrderPayment()`, when payment is verified `COMPLETE`, runs a Prisma transaction decrementing `productStock` by `item.quantity` for all ordered products.
- [x] **Task 2.3: Fix Sales Accounting (Only Record for PAID Orders)** *(Owner: Agent)*
  - Files: `app/api/orders/route.js` & `lib/payments.js`
  - Action: Removed premature `prisma.sale.createMany()` from initial order placement. Created `Sale` records inside the `PAID` confirmation transaction in `lib/payments.js`.
  - Result: Dashboard revenue and vendor sales only reflect real, completed payments.
- [x] **Task 2.4: Fix Cart Summary Shipping Fee** *(Owner: Agent)*
  - File: `components/frontend/CartSubTotalCard.jsx`
  - Action: Removed the hardcoded `10.0` shipping fee.
  - Result: Clearly displays "Calculated at checkout" and shows exact subtotal without unexpected added charges.
- [x] **Task 2.5: Add Pending-Payment Retry on Order History** *(Owner: Agent)*
  - File: `components/Order/OrderCard.jsx`
  - Action: Displays order payment status badge (`PAID`, `PENDING`, `FAILED`). Added a "Pay Now" action button for pending orders that resumes payment.
- [x] **Task 2.6: Wallet & Currency Symbol Consistency** *(Owner: Agent)*
  - Files: `components/Order/OrderCard.jsx`, `app/(back-office)/dashboard/wallet/page.jsx`
  - Action: Replaced all lingering `$` signs with `KSh`. Updated wallet page to count only completed paid sales.

---

### 🟡 Phase 3: Transactional Email via Resend

- [ ] **Task 3.1: Resend Domain Setup** *(Owner: You)*
  - Add `meedcollections.store` domain in Resend dashboard.
  - Add the DKIM and SPF DNS records in your domain registrar.
- [x] **Task 3.2: Update Sender Identity & Password Reset Link** *(Owner: Agent)*
  - File: `app/api/users/forgot-password/route.js`
  - Action: Updated `from:` address to `Meed Collections <orders@meedcollections.store>`. Uses full base URL for reset link.
- [x] **Task 3.3: Customer Order Confirmation Email** *(Owner: Agent)*
  - File: `lib/email.js`
  - Action: Created and linked email receipt to customer with item details, shipping address, and order total upon successful payment.
- [x] **Task 3.4: Admin New-Order Alert** *(Owner: Agent)*
  - File: `lib/email.js`
  - Action: Sends instant email notification to store owner when a new paid order arrives.

---

### ✅ Phase 4: Launch Polish & Production Hardening

- [x] **Task 4.1: Fix React Hydration Mismatch Warnings** *(Owner: Agent)*
  - File: `app/layout.js`
  - Action: Added `suppressHydrationWarning` to `<html>` for clean rendering with `next-themes`.
- [x] **Task 4.2: Prevent SSR Network Timeouts (ETIMEDOUT)** *(Owner: Agent)*
  - Configured canonical base URL fallback to `https://meedcollections.store` rather than failing on localhost loops.
- [x] **Task 4.3: Sanitize Console Logs (Security)** *(Owner: Agent)*
  - Files: `LoginForm.jsx`, `RegisterForm.jsx`, `OrderSummary.jsx`, `order-confirmation/page.jsx`
  - Action: Removed all console logging of user credentials, plain passwords, and payload data.
- [x] **Task 4.4: Mobile Layout & Viewport Polish** *(Owner: Agent)*
  - Files: `app/(front-end)/login/page.jsx`, `register/page.jsx`, `forgot-password/page.jsx`, `reset-password/page.jsx`
  - Action: Replaced `md:h-screen` clipping with `min-h-screen` to prevent cut-off on mobile devices.
- [x] **Task 4.5: Custom 404 Page & SEO OpenGraph Tags** *(Owner: Agent)*
  - File: `app/not-found.jsx`
  - Action: Built a custom styled 404 page with navigation back to storefront.
- [ ] **Task 4.6: Full End-to-End Audit & Verification** *(Owner: You & Agent)*
  - Register customer → Browse → Add to Cart → Checkout → M-Pesa Payment → Stock Decrement Check → Receipt Received → Order Viewable in Dashboard.


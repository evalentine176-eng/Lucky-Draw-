# Lucky Draw — MiniPay prototype

This is the first MiniPay-ready UI prototype for Lucky Draw.

## Current behavior

- Fixed entry fee shown as **0.083 cUSD**
- Number selection from **000–999**
- Random-number button for UI testing
- MiniPay/EIP-1193 wallet detection with automatic account read
- Ticket generation in prototype mode
- Weekly draw countdown
- Terms and Privacy pages
- Mobile-first layout
- PWA manifest

## Important

The prototype deliberately does **not** move real funds.

Before a real-money launch, the app needs:
1. A production smart contract for entries, prize accounting and winner settlement.
2. A verified randomness mechanism suitable for Celo.
3. A production cUSD/token configuration and treasury/prize addresses.
4. Security testing/audit.
5. Complete Terms, Privacy, eligibility and draw rules.
6. Legal/regulatory review and MiniPay approval.

## Testing in MiniPay

MiniPay's current developer documentation says Mini Apps are hosted web apps and can be loaded during development through MiniPay's developer/test flow. Production listing requires an HTTPS URL and submission to MiniPay.

For local development, serve this directory over HTTP/HTTPS and use MiniPay's Developer Settings / Load test page.

## Production architecture

PLAYER
  -> Lucky Draw Mini App
  -> smart contract
  -> fixed entry fee: 0.083 cUSD
  -> entries close
  -> verifiable randomness
  -> winning number 000-999
  -> winner determination
  -> prize settlement

Do not replace the randomness mechanism with block.timestamp, blockhash, or a server-generated number for a production draw.

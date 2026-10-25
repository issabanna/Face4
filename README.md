# Face4 — personal style prototype

An interactive, responsive concept built from Issa's brief. Open `dist/index.html` in a modern browser, or serve the `dist` directory with a static web server. It has no dependencies or build step. Google Fonts is optional; system fonts provide fallbacks.

## Implemented

- Local JPEG/PNG/WebP portrait preview, file-size and format checks, and removal.
- User-selected style mood and color palette with clearly labeled curated suggestions.
- Personalized card, PNG export, native file sharing when supported, and a Facebook website invitation for hosted versions.
- Free initial assessment including first-impression presentation tips, plus hair, frames, colors, and portrait styling ideas. First-impression tips follow the selected style mood; they are not photo analysis or personality judgments.
- Responsive layout, keyboard focus states, consent checkbox, reduced-motion support, accessible modal, and payment/analysis disclosures.

Photos stay in browser memory. There is no image upload, database, tracking script, or payment collection. Native sharing lets the visitor intentionally send a generated card to their chosen destination.

## Not connected

This is a prototype, not an operational AI or paid-report service. Suggestions are selected from curated copy using explicit form choices. It does not score attractiveness, estimate age, infer personality, or recommend employment from a face. No paid report is unlocked by a client-side flag, and no pretend checkout collects money.

## PayPal research — Jordan, checked 25 October 2026

PayPal's supported-feature table lists Jordan as supporting send, receive, and withdraw. Its seller-onboarding table lists standard PayPal Checkout for Jordan business accounts and does not list Expanded Checkout availability for Jordan. Actual account approval and available withdrawal options must be verified in the merchant account.

Guest checkout may let buyers pay by debit or credit card without an account, but PayPal says this option is not always offered and depends on factors including buyer location and risk checks. Do not promise acceptance of every country's cards.

Official references:

- https://developer.paypal.com/payouts/supported-features/
- https://developer.paypal.com/platforms/seller-onboarding
- https://www.paypal.com/c2/cshelp/article/how-do-i-accept-cards-with-checkout-using-the-guest-checkout-option--help307?locale.x=en_C2

## Remaining launch work

1. Confirm the product scope, pricing/currency, and report contents with the owner. Brand: Face4. Proposed domain: face4.org (reported available by the owner; not registered or connected here).
2. Connect an authorized image-analysis provider through a server endpoint. Keep provider keys off the browser. Return observations tied to visible styling features and mark uncertainty. Use self-reported interests and skills for any career/acting exploration.
3. Add actual consent and retention controls for server processing; define deletion, storage access, and report ownership. Do not make the prototype's local-only privacy promise once server uploads are enabled.
4. Configure PayPal Business credentials through server secrets. Create orders on the server using a fixed product/price, capture and verify order status and amount on the server, handle replay/idempotency, and grant a report only after verified payment. Test sandbox success, cancellation, failure, and duplicate callbacks before live mode.
5. Use expiring access to private reports. Share only a card that the visitor explicitly approves, without exposing the source photo or private report through an unrestricted URL.
6. Publish and test a public visitor experience before promoting Facebook links. Owner-private Sites cannot serve a public viral funnel. The owner must explicitly request public access when ready.
7. Test on mobile devices and target-market checkout accounts. This environment provided no browser preview tools, so visual browser QA remains outstanding.

## Repository and publication status

Source repository: https://github.com/issabanna/Face4

The working static prototype lives in `dist/`. Download or clone this repository and open `dist/index.html` to try it.

### Hosting

Not published. The installed Sites skill instructions refer to a `site-workflow.mjs` source/publishing helper that is missing from this executor. The plugin helper was not found under `/opt`, `/workspace`, or the rest of the accessible filesystem. No Site was registered, to avoid leaving an empty hosted project. Resume with the Sites plugin helper installed, then register this directory, persist the returned project ID, synchronize the exact source state, package, and deploy privately using the supported workflow.

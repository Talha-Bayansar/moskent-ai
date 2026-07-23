# First-release communication channel constraints

**Research date:** 2026-07-23  
**Scope:** one-way broadcasts from a mosque to a selected Moskent Audience through WhatsApp Business Platform and email. Replies and shared-inbox workflows are out of scope.

## Executive conclusion

Moskent can support both channels, but they are not interchangeable:

- **Email is the lower-friction native channel.** A provider API can send individualized messages, report delivery events, and manage bounces and complaints once a sending identity is verified. The hard parts are consent/purpose, domain authentication, unsubscribe handling, reputation, and tenant isolation—not message composition.
- **WhatsApp is a governed channel, not a generic “send text” API.** A mosque must obtain WhatsApp-specific opt-in, use approved message templates for business-initiated broadcasts, maintain quality, respect recipient limits, and complete Meta asset and payment onboarding. A multi-mosque SaaS integration also requires Moskent to become an approved Meta Tech Provider or work through a Solution Partner.
- **The product should first build one provider-neutral communication workflow:** Audience snapshot → eligibility/consent check → draft → human approval → channel rendering → final recipient preview → send/export → immutable delivery history. Channel adapters should sit behind this workflow.
- **Do not promise “send to WhatsApp groups.”** The researched Business Platform model sends to individual WhatsApp phone numbers. A first-release broadcast is therefore one message per eligible recipient, not publication into an existing community group.
- **Exact provider choice and exact WhatsApp rate-card amounts remain later procurement decisions.** They change independently of the Moskent domain model. The first-release architecture should record actual provider charges and make quotas/rates configuration, not business logic.

This is product research, not legal advice. A Belgian pilot should have its actual notices, lawful bases, retention periods, and controller/processor roles reviewed before production sending.

## 1. Shared legal and consent baseline

### Not every mosque message is “marketing”

The sending purpose matters. A cancellation notice for a class in which a person is enrolled is different from promoting a new public event. Moskent should therefore never model consent as one global `may_contact` Boolean. It needs, at minimum:

- channel (`email`, `whatsapp`);
- purpose/category (for example `operational`, `event_updates`, `community_news`, `fundraising`);
- the mosque organization acting as sender;
- status (`granted`, `withdrawn`, `not_required_with_basis`, `unknown`);
- source, wording/version, timestamp, and actor;
- the Person/Responsible Adult to whom the destination belongs.

For electronic **direct marketing**, Article 13 of the ePrivacy Directive starts from prior consent, allows a narrow “soft opt-in” for a customer's address obtained during a sale of similar products/services with a free and easy objection at collection and in every message, and prohibits concealing the sender or omitting a valid stop address ([Directive 2002/58/EC, Article 13](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32002L0058)). Belgium's Data Protection Authority treats promotional content broadly and its current direct-marketing recommendation specifically discusses the default consent rule, Belgian implementation, and the soft-opt-in exception ([Belgian DPA direct-marketing recommendation](https://www.autoriteprotectiondonnees.be/publications/recommandation-01-2025-relative-aux-traitements-de-donnees-a-caractere-personnel-dans-le-cadre-du-marketing-direct.pdf), [Belgian DPA publication update](https://www.dataprotectionauthority.be/professioneel/nieuws/2025/03/10/openbare-raadpleging-over-direct-marketing)).

Practical consequence: Moskent must classify a communication's purpose before resolving recipients. “They are in the People directory” or “they attended once” is not enough to infer permission for promotional broadcasts.

### Withdrawal and suppression are first-class data

Withdrawal must be easy, channel/category-specific, and take effect before the next send. A suppression record must win over an Audience rule or CSV import. It should be retained as proof that Moskent must *not* send, even if the underlying Person is later re-imported.

For children, the destination should normally resolve to the appropriate Responsible Adult under the already-defined relationship and contact-purpose rules. A child's own destination must not be silently substituted.

## 2. WhatsApp Business Platform

### Opt-in rules

Meta requires a business to obtain consent from people it wishes to message on WhatsApp. The request must clearly say that the person agrees to messages, clearly name the business that will send them, and comply with applicable law. Meta permits several collection methods, including web, phone, paper/in-person and a user initiating a WhatsApp conversation. Meta also recommends distinguishing message categories, giving clear opt-out instructions, honoring those requests, and monitoring quality ([Meta: Getting opt-in for WhatsApp](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in)).

Product implications:

- Email consent cannot automatically become WhatsApp consent.
- Consent should identify the **mosque**, not merely “Moskent,” because the mosque is the visible sender.
- The send preview must exclude `unknown` and `withdrawn` WhatsApp destinations.
- An inbound `STOP`-like request or equivalent user preference must create a suppression promptly even though a two-way inbox is out of scope.

### Business-initiated broadcasts require templates

Outside the user-initiated 24-hour customer-service window, a business initiates contact with a message template. Templates are automatically reviewed when created or edited; only `APPROVED` templates can be sent, and status may later change due to quality feedback. Status changes are available through webhooks and the Template API ([Meta: Template basics](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview), [Meta: Sending messages and customer-service windows](https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages)).

Templates carry a language code. Meta does not translate template strings or variables, so Dutch, French, English, Arabic, or other variants must be authored and approved separately ([Meta: Template basics](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview)).

Meta says utility templates are generally responses to a user action/request, such as a confirmation or update, and applies strict non-marketing rules; utility content containing marketing is automatically reclassified as marketing ([Meta: Utility templates](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/utility-templates/utility-templates/)). General event invitations, community news, and fundraising should therefore be budgeted and designed as **marketing templates** unless Meta approves a narrower category. Operational updates tied to an existing registration may qualify as utility, but Moskent should store Meta's returned category rather than infer the final category itself.

There are two approvals:

1. **Meta template approval**, which determines whether the template may be sent.
2. **Mosque human approval**, which determines whether this instance, variables, Audience snapshot, schedule, and cost estimate may be sent.

AI may draft text and suggest a template, but must not submit a new template or start a broadcast without explicit authorized confirmation.

### Delivery, limits, and quality

Cloud API reports inbound messages, asynchronous errors, and outbound delivery-status updates through webhooks ([Meta: WhatsApp Business Platform overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/about-the-platform)). Moskent should normalize at least `queued`, `provider_accepted`, `sent`, `delivered`, `read` (when available), `failed`, and `suppressed`, while retaining provider IDs and raw event references for support.

Meta's messaging limit is the maximum number of unique WhatsApp recipients a business portfolio may contact outside customer-service windows during a rolling 24 hours. It is shared by all business phone numbers in the portfolio. A newly created portfolio starts at **250 unique recipients** and can move through higher tiers based on verification, usage, and quality ([Meta: Messaging limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits)). This is a real pilot constraint for a 50–500-member mosque: the first large broadcast may need staged onboarding and tier growth.

Raw throughput is less likely to constrain Moskent's pilot: Cloud API currently supports up to 80 messages/second per registered business number by default and may automatically upgrade to 1,000 messages/second ([Meta: Throughput](https://developers.facebook.com/documentation/business-messaging/whatsapp/throughput)). Recipient eligibility, quality, and tier limits matter more than request speed.

Failed API acceptance is not delivery. The product must show per-recipient and aggregate status, expose partial failure, and prevent automatic retries from creating duplicates. Provider message IDs and idempotency keys are required.

### Pricing structure

Meta has charged Cloud API business messages per **delivered template message** since 1 July 2025. The rate varies by the template category and the recipient's WhatsApp country calling code. Utility and authentication templates can receive volume-tier discounts; Meta also documents limited free cases inside open customer-service or free-entry-point windows ([Meta: WhatsApp Business Platform pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)).

For first-release broadcasts, assume:

- one billable delivery attempt per eligible recipient when a template is delivered;
- marketing pricing for broad invitations/news unless Meta classifies otherwise;
- separate possible fees from a Business Solution Provider;
- rates can change by launch date and market.

The pricing docs were updated on 1 July 2026 and announce additional changes for certain service, utility, and Meta Business Agent messages from August/October 2026 ([Meta: upcoming pricing updates](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)). Moskent should fetch/configure rates and show a conservative estimate before approval; it should not hard-code today's rate card.

### Identity and onboarding

Each mosque needs Meta assets:

- a Meta business portfolio (required container);
- a WhatsApp Business Account (WABA);
- a verified business phone number and display name;
- a payment method unless billing is provided through an eligible Solution Partner.

Meta's Embedded Signup flow lets a business authenticate, accept terms, select/create a portfolio and WABA, verify a phone number, choose a display name, grant app access, and return identifiers/token material for server-side setup. Moskent then exchanges the code, registers the number, and subscribes to webhooks. Meta explicitly notes that Embedded Signup v2 is deprecated on 15 October 2026, so implementation must target the current supported flow rather than copy an older tutorial ([Meta: Embedded Signup](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview)).

Because other mosques will use the Moskent app, Moskent is not merely a direct developer integrating its own number. Meta's current Tech Provider path requires Moskent to:

- have and verify its own Meta business;
- submit the app for App Review;
- demonstrate sending a message and managing a template in videos;
- obtain Advanced Access for `whatsapp_business_messaging` and `whatsapp_business_management`;
- use business tokens and securely subscribe each onboarded WABA to webhooks.

([Meta: Become a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers), [Meta: Solution-provider App Review](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/app-review)).

The preferred ownership model is that each mosque owns its portfolio, WABA, number, display identity, consent evidence, and billing relationship, then grants Moskent scoped access. That improves portability and avoids one mosque's limits or quality problems consuming another's portfolio-level capacity.

### WhatsApp integration capabilities and non-capabilities

Useful first-release capabilities:

- approved localized templates with variables;
- image/document media suitable for an event poster;
- send API per individual phone number;
- delivery/read/failure webhooks;
- template-status and quality monitoring;
- opt-out/suppression ingestion from inbound webhooks.

Out of scope or unsafe to promise:

- posting into existing WhatsApp groups/communities through this business broadcast flow;
- a shared reply inbox;
- free-form outbound messaging outside an open customer-service window;
- guaranteed delivery/read;
- AI autonomously choosing recipients or sending;
- importing phone numbers as proof of consent.

## 3. Email

### Consent, sender identity, and unsubscribe

Email uses the same purpose/lawful-basis analysis described above. Promotional or mixed-purpose broadcast messages should carry a visible, free unsubscribe route; Moskent must also honor category-specific withdrawal in its own suppression store rather than rely only on a provider's list.

At the protocol level, RFC 8058 defines one-click list unsubscribe using `List-Unsubscribe` and `List-Unsubscribe-Post` headers and requires a valid DKIM signature covering those headers ([RFC 8058](https://www.rfc-editor.org/rfc/rfc8058)). Moskent's email adapter should support that standard from day one for subscribed/broadcast mail.

Mailbox providers impose additional reputation requirements. Google's sender guidance requires authentication and low spam rates for mail to personal Gmail accounts, with stronger SPF, DKIM, DMARC, alignment, and one-click-unsubscribe requirements for bulk senders ([Google: Email sender guidelines](https://support.google.com/a/answer/81126?hl=en)). Even if one mosque is below Google's bulk threshold, implementing the stronger baseline avoids a later migration.

Each mosque should preferably verify a domain or dedicated subdomain such as `mail.mosque.example`. Domain verification requires DNS access and enables authenticated sending for addresses under that identity; provider documentation illustrates DKIM-based domain verification and DNS propagation requirements ([AWS SES: Creating and verifying identities](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html)). A central Moskent domain can be an onboarding fallback, but it pools reputation and weakens the visible mosque identity. That trade-off needs an explicit product decision.

### Provider onboarding and delivery limitations

Email providers commonly protect new accounts with a sandbox or review. For example, new Amazon SES accounts can initially send only to verified recipients, are capped at 200 messages per 24 hours and 1 message/second, and must request production access. That request requires a website, mail-type declaration, confirmation that recipients explicitly requested mail, and a bounce/complaint process ([AWS SES: Moving out of the sandbox](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html)).

Provider acceptance still does not guarantee inbox placement. Moskent must:

- process delivery, bounce, complaint, and suppression webhooks;
- stop sending to hard bounces and complaints;
- throttle and retry transient failures with idempotency;
- keep the recipient list private by sending individualized messages, not a visible `To`/`CC` list;
- treat open tracking as approximate and optional, not proof that a Person read the message;
- make click/open tracking configurable because it adds tracking data and privacy implications.

The reliable first-release metrics are attempted, provider accepted, delivered where reported, bounced, complained, unsubscribed, and failed. “Opened” and “read” must never drive sensitive conclusions about a Person.

### Pricing structure

Email cost is generally based on recipient/message volume, with possible charges for attachment data, validation, dedicated IPs, deliverability tooling, or a monthly plan. As a low-level reference point, Amazon SES currently lists pay-as-you-go outbound email at **USD 0.10 per 1,000 emails** plus **USD 0.12/GB** of outgoing attachment data, with optional dedicated-IP and deliverability add-ons ([AWS SES pricing](https://aws.amazon.com/ses/pricing/)). Managed developer-focused providers often bundle API, SMTP, webhooks, suppression, dashboards, retention, and support into volume tiers rather than exposing the lowest unit cost.

This price difference is too small at pilot mosque volumes to choose a provider on unit price alone. Procurement should compare:

- EU/EEA processing location options, DPA and subprocessor terms;
- domain/tenant isolation and reputation controls;
- REST API, SMTP, batch/send scheduling, and webhook quality;
- suppression export and provider portability;
- retention controls and webhook signing;
- support during deliverability incidents;
- nonprofit pricing and predictable overages.

### Email integration capabilities

A provider-neutral adapter can expose:

- verify-domain state and required DNS records;
- send one rendered message to one recipient;
- schedule/cancel where supported;
- provider template or raw HTML/text mode;
- attachments/hosted poster links;
- delivery/bounce/complaint webhooks;
- suppression synchronization;
- cost and quota reporting.

The Moskent communication record, consent evidence, rendered content, Audience snapshot, approval, and audit trail must remain in Moskent rather than becoming provider-owned data.

## 4. Feasible first-release strategies

| Strategy | What ships | Advantages | Constraints / risk | Best fit |
|---|---|---|---|---|
| **A. Draft and export/handoff** | Moskent resolves the Audience, drafts and approves content, then exports recipients/content or opens an external tool. | Fastest; no provider credentials; validates workflow. | Weak delivery history; manual consent/suppression reconciliation; unsafe if users paste visible recipient lists; no true “send from Moskent.” | Earliest prototype or fallback while channel approval is pending. |
| **B. Native email, WhatsApp handoff** | Email uses an API adapter; WhatsApp produces approved content/poster and an operational export until Tech Provider/BSP onboarding is complete. | Delivers one end-to-end native channel quickly; avoids pretending WhatsApp compliance is solved. | Split user experience; manual WhatsApp history; handoff cannot safely scale to large lists. | Sensible MVP if Meta approval is not ready. |
| **C. Native email plus direct Meta Cloud API** | Moskent becomes a Tech Provider; each mosque connects owned Meta assets through current Embedded Signup. | Best ownership, product control, delivery telemetry, and portability. | Business verification, App Review, template lifecycle, billing setup, webhook operations, 250-recipient starting tier, changing Meta flows. | Target architecture once platform approval is secured. |
| **D. Native email plus WhatsApp Solution Partner/BSP** | A partner supplies some onboarding, billing, API, or operational layer. | Can shorten Meta operations and support burden. | Extra fees, vendor-specific API/limits, possible weaker asset/billing portability, still requires consent/templates/quality. | Alternative when speed/support outweigh direct control. |

No researched fact justifies selecting a specific email vendor or WhatsApp Solution Partner yet. The decision depends on deployment region, existing cloud, expected mosque count and volume, support needs, Meta approval timeline, and commercial terms.

## 5. First-release product requirements

### Core records

- `Communication`: organization, purpose/category, source Event/Meeting, owner Team, content/version, lifecycle.
- `ChannelVariant`: email or WhatsApp rendering, language, provider template reference/status.
- `AudienceSnapshot`: immutable resolved Persons and the rule/version that selected them.
- `ContactPoint`: normalized address/phone, verification and ownership state.
- `ContactPreference`: channel + purpose + mosque scope, evidence, notice version, granted/withdrawn timestamps.
- `Suppression`: channel + destination + scope + reason + source.
- `Approval`: approver, timestamp, approved content hash, recipient count, estimated cost.
- `DeliveryAttempt`: recipient, channel, provider ID, idempotency key, status timeline, error classification, charge where available.
- `ChannelConnection`: mosque-owned identity IDs and status; secret material must live in dedicated secret storage, never in Copilot context or ordinary audit fields.

### Send gate

Moskent must refuse or pause a send unless:

1. the actor has scoped permission to communicate to the selected Audience;
2. every recipient resolves to an eligible contact point and Responsible Adult rule;
3. preference/lawful-basis evidence exists for the declared purpose;
4. suppressions are applied;
5. channel identity is active;
6. WhatsApp template/language is approved and current;
7. limits and projected cost are shown;
8. an authorized human approves the exact content hash and recipient snapshot.

Any audience or content change after approval invalidates approval.

### AI boundary

AI may draft, translate, suggest timing, detect missing consent, summarize projected reach/cost, and flag delivery anomalies. It may not:

- infer consent or a lawful basis;
- downgrade “marketing” to “utility” to reduce WhatsApp cost;
- silently alter an approved template/recipient set;
- expose destinations or message history to users lacking People/Communication permission;
- send, retry a broad failure, or submit a template without confirmation;
- treat non-open/read as a finding about a person's beliefs, commitment, or engagement.

## 6. Decisions newly surfaced

These require explicit product decisions before implementation:

1. **Native-channel launch scope:** native email first with WhatsApp handoff, or delay “send from Moskent” until both are native.
2. **WhatsApp route:** direct Tech Provider integration versus a named Solution Partner/BSP.
3. **Asset ownership:** confirm that each mosque owns its WABA, phone number, display identity, payment method, templates, and consent evidence.
4. **Email sender identity:** require a mosque-owned domain/subdomain, or allow a centrally managed Moskent-domain fallback with pooled reputation.
5. **Communication taxonomy:** define which mosque messages are operational, event updates, community news, fundraising, or another purpose, and map each purpose to consent/lawful-basis rules and Meta template category.
6. **Consent migration:** decide what evidence is acceptable when importing existing WhatsApp/email lists; an address or group membership alone must not qualify.
7. **Minor/guardian routing:** define when a child may be directly contacted and otherwise which Responsible Adult purpose/priority resolves the destination.
8. **Approval policy:** decide which roles may approve, whether author and approver must differ, and thresholds for large/sensitive/paid sends.
9. **Reply/opt-out ingestion:** even with no shared inbox, define how inbound opt-outs and other replies are triaged so suppression is prompt.
10. **Tracking policy:** choose whether email open/click tracking and WhatsApp read receipts are enabled, how they are disclosed, retained, and excluded from sensitive AI findings.
11. **Retention:** set periods for rendered content, Audience snapshots, consent evidence, raw provider payloads, and delivery events.
12. **Rate and quota ownership:** decide whether channel charges are paid directly by each mosque or metered/rebilled by Moskent; actual rates must remain configurable.

## 7. Suggested validation gates

Before calling the communication feature launch-ready, the pilot should prove:

- a multilingual message can be drafted, reviewed, approved, and sent without exposing recipients to one another;
- withdrawals and hard bounces suppress the next campaign even if Audience membership still matches;
- an Audience change invalidates an earlier approval;
- partial delivery failure can be retried idempotently per recipient;
- a new mosque can verify its sender identity without Moskent staff handling raw credentials;
- one mosque's status, quota, reputation, consent, and provider events cannot affect or appear in another mosque;
- actual sent count, delivered/failure count, exclusions, and provider charges reconcile to the immutable Audience snapshot;
- WhatsApp tier limits and template rejection/pausing produce a visible blocked state rather than silent failure;
- Copilot cites the delivery and preference records behind any communication insight and cannot initiate a send.

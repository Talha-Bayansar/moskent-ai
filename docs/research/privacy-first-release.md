# Privacy constraints for Moskent's first release

**Status:** Product research, not legal advice  
**Jurisdictional scope:** EU GDPR and Belgium  
**Product scope:** A multi-tenant SaaS used by independently governed mosques, initially for internal coordination, including Persons, Responsible Adult Links, Audiences, Teams, Meetings, Tasks, Events, basic Finance, communications, an Access Register, and AI-assisted summaries, findings, recommendations, and drafts.

## Executive conclusion

Moskent should treat almost all tenant operational data as sensitive from the beginning. A person's inclusion in a mosque directory, attendance at a mosque event, Team membership, or inclusion in an Audience can reveal or strongly imply religious belief even if Moskent never stores a `religion` field. Religious belief is a special category of personal data under GDPR Article 9. A religious not-for-profit may have a narrow route to process data about members, former members, and people in regular contact in the course of legitimate activities, with safeguards and no disclosure outside the body without consent (Article 9(2)(d)); that is not a blanket exemption.

The first release should therefore ship as a privacy-partitioned system of record:

- every Mosque Organization is a hard tenant boundary;
- authorization is explicit, least-privilege, and purpose-aware;
- child and Responsible Adult data has narrower defaults than ordinary directory data;
- AI sees only data the requesting user may see, cites the records behind a finding, never trains on tenant data by default, and cannot make or execute sensitive decisions;
- each processing purpose has a documented Article 6 lawful basis and, where applicable, a separate Article 9 condition;
- retention, data-subject requests, audit, breach response, processors, and international transfers are designed capabilities, not later policy documents.

A DPIA should be completed before a production pilot that enables AI analysis of people, children, attendance, finances, or communications. Whether it is legally mandatory for a particular deployment depends on scale and the exact processing, but the combination of vulnerable people, special-category data, systematic analysis, and new technology makes it the prudent launch gate.

## Binding requirements that shape the product

### 1. Directory membership can itself reveal religion

GDPR Article 9 prohibits processing personal data revealing religious or philosophical beliefs unless an Article 9(2) condition applies. Moskent should assume that Person records, Team and class membership, attendance, donations, communications, and even account metadata may reveal religious affiliation by context. Labels such as “not a member” or “visitor” do not reliably remove that inference.

Article 9(2)(d) permits processing by a not-for-profit body with a religious aim in the course of legitimate activities, with appropriate safeguards, where processing relates solely to members, former members, or persons who have regular contact with it in connection with its purposes. The data must not be disclosed outside that body without the person's consent. The scope of “regular contacts,” what constitutes disclosure when vendors process the data, and whether a particular Mosque Organization has the required not-for-profit/religious character need deployment-specific assessment.

Article 9 is only the special-category gate. The controller must also identify an Article 6 lawful basis for every purpose and comply with the Article 5 principles: lawfulness, fairness and transparency; purpose limitation; data minimisation; accuracy; storage limitation; integrity/confidentiality; and accountability. [GDPR, especially Articles 5, 6 and 9](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), [Belgian DPA guidance on sensitive data](https://www.dataprotectionauthority.be/burger/thema-s/gevoelige-gegevens)

**Product consequence:** Do not expose a tenant-wide Person directory by default. Treat list membership, filters, search results, exports, AI embeddings, logs, notifications, and analytics as sensitive—not only field values.

### 2. Lawful basis must be purpose-specific

A mosque cannot select one universal lawful basis for “using Moskent.” It must map each purpose to:

1. an Article 6 basis; and
2. an Article 9(2) condition whenever special-category data is involved.

Possible bases will vary. Contract may fit some account administration; legal obligation may fit particular accounting records; legitimate interests may fit carefully balanced internal operations; consent may fit genuinely optional uses; Article 9(2)(d) may fit core legitimate activities for the defined people. Consent is valid only when freely given, specific, informed, unambiguous, demonstrable, and as easy to withdraw as to give. Explicit consent is required where Article 9(2)(a) is used. The Belgian DPA warns that bundled, coerced, or opt-out consent is not free/specific and that controllers must retain evidence and support withdrawal. [Belgian DPA guidance on consent](https://www.dataprotectionauthority.be/professioneel/avg/rechtsgronden/toestemming), [EDPB Guidelines 05/2020 on consent](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en)

**Product consequence:** Maintain a processing-purpose register rather than a single “consent” checkbox. Store the lawful-basis decision, Article 9 condition, notice version, retention rule, recipients, and owner for each purpose. Consent records should be granular and revocable, but Moskent must not manufacture consent when another basis is more appropriate.

### 3. Children require enhanced protection

Children are vulnerable data subjects, and GDPR Recital 38 calls for particular protection, especially for marketing, personality/user profiles, and services offered directly to children. Belgium sets the Article 8 threshold at **13** for consent-based information-society services offered directly to a child. Below 13, consent must come from the holder of parental responsibility and the controller must make reasonable efforts to verify it. Article 8 is narrow: it does not mean every processing operation involving a Belgian child is lawful with parental consent, nor does turning 13 automatically resolve capacity, family-law, or image-right questions. [Belgian Act of 30 July 2018, Article 7](https://www.dataprotectionauthority.be/publications/act-of-30-july-2018.pdf), [Belgian DPA guidance on minors and consent](https://www.dataprotectionauthority.be/professioneel/avg/rechtsgronden/toestemming)

Information addressed to children must be clear and understandable. Data gathered from a parent, guardian, teacher, spreadsheet import, or another source normally also triggers Article 14 transparency duties toward the child/data subject, subject to its limited exceptions. [GDPR Articles 12–14](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng)

**Product consequence:**

- First release: children may be Persons but should not receive user accounts.
- A Responsible Adult Link is a contact/safeguarding fact, not proof of legal authority, consent, custody, or digital access.
- Store relationship type, purpose, verification state, validity dates, and contact restrictions as structured fields. Avoid open-ended family or safeguarding notes.
- Restrict full Responsible Adult Link management to specifically authorized roles; ordinary organizers should receive only the contact detail needed for the current activity.
- No child profiling, rankings, inferred risk labels, behavioural scores, targeted marketing, or cross-Team discoverability in the first release.
- Treat identifiable child photos and generated/edited likenesses as a separate launch question involving GDPR, Belgian image rights, and consent/capacity rules.

### 4. AI findings and recommendations are personal-data processing

GDPR defines profiling as automated processing used to evaluate personal aspects, including work performance, economic situation, preferences, interests, reliability, behaviour, location, or movements (Article 4(4)). Moskent features such as “overloaded volunteers,” “unusual expenses,” participation trends, attendance-drop explanations, or suggested audiences can create profiles and new personal data even when their output is labelled as an “insight.”

Article 22 gives a right not to be subject to a decision based solely on automated processing, including profiling, that produces legal or similarly significant effects, subject to narrow exceptions and safeguards. Human confirmation is not meaningful merely because someone can click “approve”: the reviewer must have authority, sufficient information, and a real ability to challenge the output. Children deserve particular protection from such decisions. [GDPR Articles 4(4), 13–15, 21–22 and Recital 71](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), [EDPB Guidelines on automated decision-making and profiling](https://www.edpb.europa.eu/documents/guideline/automated-decision-making-and-profiling_en)

The EDPB's AI-model opinion also makes clear that anonymity and legitimate interest require case-by-case analysis; model development and deployment are separate processing operations, and unlawfully processed model data can affect deployment lawfulness. [EDPB Opinion 28/2024 on personal data in AI models](https://www.edpb.europa.eu/documents/opinion-of-the-board-art-64/opinion-282024-on-certain-data-protection-aspects-related-to_en)

**Product consequence:**

- AI is advisory. It cannot decide Team eligibility, safeguarding action, financial misconduct, access revocation, volunteer reliability, or whom to exclude.
- Do not infer religious commitment, family status, vulnerability, trustworthiness, or safeguarding risk.
- Every personalized finding must identify its purpose, the records and time window used, material limitations, and whether it is an observation or hypothesis.
- A user may query only records they could access directly; retrieval, prompt construction, cached responses, embeddings, charts, and exports must enforce the same authorization.
- No tenant data, prompts, outputs, embeddings, or feedback may be used to train shared models by default.
- AI subprocessors must not retain or reuse submitted data beyond the contracted service. Product settings must allow a tenant to disable AI or particular AI purposes.
- All write actions are previewed and explicitly confirmed; sending communications and changing permissions require stronger confirmation and an audit event.
- Suppress person-level AI insight for small cohorts where an aggregate would identify someone.

### 5. Transparency and data-subject rights must cover inferences

Controllers must provide the Article 13/14 notice information, including purposes, bases, recipients, retention, rights, transfers, and relevant automated decision information. Data subjects have rights including access, rectification, erasure, restriction, portability in applicable cases, objection, and rights concerning automated decisions. Controllers ordinarily must respond without undue delay and within one month (Article 12(3)). Access includes personal data held in notes, logs, AI prompts/outputs, inferred labels, and profiles, while disclosure must respect the rights of others. [GDPR Articles 12–22](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), [EDPB Guidelines 01/2022 on right of access](https://www.edpb.europa.eu/documents/guideline/guidelines-012022-on-data-subject-rights-right-of-access_en)

**Product consequence:** Ship controller tools to search a Person's data across modules, export it in understandable form, correct source facts, restrict processing, record objections, and apply an approved erasure decision. Preserve provenance so an incorrect AI inference can be traced to and corrected at its source. Do not promise deletion where a controller has a valid legal need to retain a record; support restriction and legal holds separately.

### 6. Retention cannot be indefinite

Article 5(1)(e) permits identifying data only as long as needed for its purpose. Notices must state the retention period or criteria (Articles 13/14). Different records require different schedules: active account data, former membership, attendance, communication delivery evidence, meeting notes, financial evidence, access-register custody, consent evidence, audit/security logs, AI prompts, and backups should not share a single lifetime. [GDPR Articles 5, 13 and 14](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng)

**Product consequence:** Each record type and processing purpose needs an owner, retention trigger, review period, disposal action, and any exception. Use configurable tenant policies with privacy-preserving defaults. Deletion must propagate to search indexes, analytics stores, embeddings, caches, and backups according to a documented backup lifecycle. De-identification must be tested against small-cohort and cross-record re-identification.

### 7. Controller and processor roles must reflect reality

The entity deciding why and the essential means of processing is the controller; an entity processing on its behalf is a processor. Labels in a contract do not override actual conduct. Processors require an Article 28 contract, documented instructions, confidentiality, appropriate security, subprocessor controls, assistance with rights/DPIAs/breaches, deletion or return, and audit information. Joint control is possible when parties jointly determine purposes and essential means. [EDPB Guidelines 07/2020 on controllers and processors](https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en), [GDPR Articles 26 and 28](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng)

Likely first-release allocation:

- each Mosque Organization is controller for its operational tenant data;
- the Moskent provider is normally its processor for hosting and product operations;
- infrastructure, email, monitoring, storage, and AI vendors are subprocessors;
- the Moskent provider may be a separate controller for narrowly necessary billing, account, security, and compliance data;
- cross-tenant benchmarking, shared-model training, or deciding new purposes for tenant content could make the provider a controller or joint controller and should not be included silently.

**Product consequence:** Preserve tenant-configurable purposes and notices, publish a subprocessor/location list, provide an Article 28 DPA, and technically separate processor data from provider-controller telemetry.

### 8. Security must match the sensitivity and risk

Article 32 requires appropriate technical and organizational measures based on risk, including as appropriate pseudonymisation/encryption, resilience, restoration, and regular testing. Controllers must notify the supervisory authority of a qualifying breach without undue delay and, where feasible, within 72 hours; processors notify controllers without undue delay; high-risk breaches also require communication to affected people unless an exception applies (Articles 33–34). Privacy by design/default applies to controllers of every size and throughout the lifecycle. [GDPR Articles 25 and 32–34](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), [EDPB Guidelines 4/2019 on privacy by design and default](https://www.edpb.europa.eu/documents/guideline/guidelines-42019-on-article-25-data-protection-by-design-and-by-default_en)

**Minimum first-release security guardrails:**

- hard tenant isolation in every query, job, cache, file path, search index, embedding/vector store, export, log, and support tool;
- deny-by-default permission checks on the server; role scope does not silently inherit through the Team tree;
- MFA for organization administrators and privileged roles; secure account recovery and session revocation;
- encryption in transit and at rest, managed key rotation, encrypted backups, restore tests, and secrets kept outside Moskent's Access Register;
- immutable or tamper-evident audit events for permission, export, communication, finance, Responsible Adult, access-register, and AI write actions;
- access reviews, offboarding, support-access approval, time-bound privileged access, dependency patching, vulnerability management, and tested incident response;
- logs that are useful but do not duplicate message bodies, child details, raw prompts, credentials, or full financial records.

### 9. A DPIA is a launch gate for sensitive AI

Article 35 requires a DPIA before processing likely to result in high risk, expressly including certain systematic and extensive evaluations based on automated processing and large-scale special-category processing. The EDPB's DPIA criteria include evaluation/scoring, automated decisions, systematic monitoring, sensitive data, large scale, matching datasets, vulnerable subjects, innovative technology, and preventing access to a service. [GDPR Article 35](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), [EDPB-endorsed DPIA Guidelines WP248 rev.01](https://ec.europa.eu/newsroom/article29/items/611236/en)

Belgium also publishes a binding national list of processing operations requiring a DPIA, including specified large-scale profiling, systematic exchanges of special-category data between controllers, and large-scale or systematic observation of behaviour. Moskent combines several high-risk criteria even at modest pilot scale. A documented DPIA before production AI is therefore a strong design requirement. Counsel should determine whether the final design falls within Article 35 or the Belgian list; if residual high risk remains, Article 36 prior consultation may be required. [Belgian DPA DPIA guidance](https://www.dataprotectionauthority.be/professionnel/rgpd-/analyse-d-impact-relative-a-la-protection-des-donnees), [Belgian DPA Decision 01/2019 and binding DPIA list](https://www.dataprotectionauthority.be/publications/decision-n-01-2019-du-16-janvier-2019.pdf)

### 10. International access is an international transfer issue

Personal data transferred outside the EEA needs a Chapter V mechanism: an adequacy decision, appropriate safeguards such as Standard Contractual Clauses (SCCs), or a narrow derogation. The controller must assess the actual destination and legal/practical environment and add supplementary measures where needed; merely naming SCCs is not always enough. Support or model-provider access from a third country can matter even when the primary database is in the EU. [European Commission rules on international data transfers](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/rules-international-data-transfers_en), [EDPB Recommendations 01/2020 on supplementary transfer measures](https://www.edpb.europa.eu/our-work-tools/our-documents/recommendations/recommendations-012020-measures-supplement-transfer-tools_en)

**Product consequence:** Prefer EEA data location and EEA operational access for the first release, but still inventory every subprocessor, support location, backup location, model endpoint, and onward transfer. Record the transfer mechanism and transfer-impact assessment. Give tenants advance notice of subprocessor changes and a meaningful objection/exit process.

## Recommended product privacy baseline

These measures are recommendations derived from the requirements above; not every item is independently mandated in exactly this form.

1. **Classify the whole tenant as sensitive.** Use stricter controls for child, Responsible Adult, finance, private notes, communications, and access records.
2. **Separate identity from access.** A Person is not automatically a User Account. A Responsible Adult Link is not an Access Grant.
3. **Purpose-tag data and actions.** Audiences, imports, notes, communications, AI requests, and exports should declare a purpose compatible with collection.
4. **Keep free text exceptional.** Meeting notes, contact notes, safeguarding notes, and AI prompts can accidentally accumulate highly sensitive data. Prefer structured, scoped fields and warnings.
5. **Make privacy visible in the Command Center.** Do not surface a child, guardian contact, private note, or personal performance finding merely because a widget can. Widget personalization never widens access.
6. **Use privacy-preserving analytics.** Default to Team/event aggregates, minimum cohort sizes, suppressed rare categories, short query retention, and no cross-tenant comparison.
7. **Make AI provenance first-class.** Store model/version, purpose, authorized requester, source record identifiers, output, confidence/limitations, confirmation, and resulting changes—without retaining more prompt content than needed.
8. **Provide tenant lifecycle operations.** Import review, duplicate resolution, offboarding, data export, contract-end return/deletion, retention jobs, legal holds, and deletion verification.
9. **Ban secrets and excessive safeguarding data.** The Access Register records custody and external-vault references, never passwords, API keys, recovery codes, door codes, or alarm codes.
10. **Keep communications reviewable.** Show recipients before sending, resolve Responsible Adult contacts according to purpose, exclude restricted contacts, log the lawful communication purpose, and separate operational messages from direct marketing.

## Questions requiring Belgian legal counsel before launch

These are not safe to settle through product design alone:

1. For each pilot Mosque Organization, does Article 9(2)(d) cover every intended Person category and purpose, particularly children, event visitors, donors, prospects, parents who are not members, and broad announcement Audiences?
2. Does giving Moskent and its subprocessors access constitute a permitted processor arrangement under that condition, and what safeguards/documentation are needed given Article 9(2)(d)'s non-disclosure language?
3. Which Article 6 basis and Article 9 condition apply to each exact workflow: directory, attendance, Responsible Adult Links, volunteer management, donations/expenses, Access Register, communications, AI insights, and security logs?
4. What Belgian association, accounting, safeguarding, employment/volunteer, direct-marketing, ePrivacy, and image-right rules set minimum retention or consent requirements?
5. When may a mosque record parent, legal guardian, caregiver, pickup, emergency, custody, or contact-restriction information, how must authority be verified, and who may inspect it?
6. Is Moskent an information-society service offered directly to children in the planned future community app, and what age/capacity and parental-verification journey is required in Belgium and other launch countries?
7. Does the final AI/analytics design trigger a mandatory DPIA under the Belgian DPA list, require a DPO under Article 37, or require prior consultation under Article 36?
8. Which communications are service/organizational messages and which are direct marketing requiring consent or another ePrivacy-compliant route, especially over email, SMS, and WhatsApp?
9. Are the chosen US or other non-EEA cloud/AI vendors and transfer safeguards acceptable for religious and child data after a transfer-impact assessment?
10. What exact controller/joint-controller role does the Moskent provider assume for fraud/security telemetry, support, product analytics, cross-tenant insights, and any future model improvement?

## Newly surfaced product decisions

The blueprint should explicitly decide:

- **Privacy posture:** treat each tenant's full operational dataset as capable of revealing religion.
- **Child accounts:** no child User Accounts in the first release.
- **AI training:** no provider or model training on tenant data by default.
- **Cross-tenant AI:** no cross-tenant benchmarking or retrieval in the first release.
- **AI decisions:** no person scoring or solely automated significant decisions; sensitive actions always require meaningful human review.
- **DPIA:** completed and approved before enabling production AI on real tenant data.
- **Data location:** EEA-first hosting and operational access, subject to a complete vendor/transfer assessment.
- **Access Register:** custody metadata and external-vault references only; never actual secrets or door/alarm codes.
- **Rights and retention:** first-release administrator tooling must cover access/export, correction, restriction/objection, approved erasure, and purpose-specific retention.
- **Communications:** operational and marketing purposes must be distinct in Audience selection, approval, consent/basis records, and delivery history.

## Primary sources

- [Regulation (EU) 2016/679 (GDPR), official consolidated text](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng)
- [Belgian Act of 30 July 2018 on the protection of natural persons with regard to personal data processing (Belgian DPA English courtesy translation)](https://www.dataprotectionauthority.be/publications/act-of-30-july-2018.pdf)
- [Belgian DPA: consent, including Belgian rules for minors](https://www.dataprotectionauthority.be/professioneel/avg/rechtsgronden/toestemming)
- [EDPB Guidelines 05/2020 on consent](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en)
- [EDPB Guidelines 07/2020 on controller and processor concepts](https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en)
- [EDPB Guidelines 4/2019 on data protection by design and by default](https://www.edpb.europa.eu/documents/guideline/guidelines-42019-on-article-25-data-protection-by-design-and-by-default_en)
- [EDPB-endorsed Guidelines WP248 rev.01 on DPIAs and high risk](https://ec.europa.eu/newsroom/article29/items/611236/en)
- [EDPB Guidelines on automated decision-making and profiling](https://www.edpb.europa.eu/documents/guideline/automated-decision-making-and-profiling_en)
- [EDPB Guidelines 01/2022 on the right of access](https://www.edpb.europa.eu/documents/guideline/guidelines-012022-on-data-subject-rights-right-of-access_en)
- [EDPB Opinion 28/2024 on personal data in AI models](https://www.edpb.europa.eu/documents/opinion-of-the-board-art-64/opinion-282024-on-certain-data-protection-aspects-related-to_en)
- [European Commission: rules on international data transfers](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/rules-international-data-transfers_en)
- [EDPB Recommendations 01/2020 on supplementary transfer measures](https://www.edpb.europa.eu/documents/recommendation/recommendations-012020-on-measures-that-supplement-transfer-tools-to_en)
- [Belgian DPA guidance on sensitive data](https://www.dataprotectionauthority.be/burger/thema-s/gevoelige-gegevens)
- [Belgian DPA guidance on DPIAs](https://www.dataprotectionauthority.be/professionnel/rgpd-/analyse-d-impact-relative-a-la-protection-des-donnees)
- [Belgian DPA Decision 01/2019 and binding DPIA list](https://www.dataprotectionauthority.be/publications/decision-n-01-2019-du-16-janvier-2019.pdf)

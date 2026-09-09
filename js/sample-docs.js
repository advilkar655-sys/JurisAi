/**
 * JurisAI Sample Legal Documents & Analysis Dataset
 */

export const SAMPLE_DOCUMENTS = {
  saas_msa: {
    id: "saas_msa",
    title: "Enterprise SaaS Master Services Agreement (MSA)",
    category: "Software & Technology",
    parties: "CloudScale Technologies Inc. (Provider) & Enterprise Corp (Client)",
    effectiveDate: "2026-01-15",
    legaleseDensity: 78,
    estReadingTime: "24 mins",
    simplifiedReadingTime: "4 mins",
    rawText: `MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is entered into as of January 15, 2026 ("Effective Date") by and between CloudScale Technologies Inc., a Delaware corporation ("Provider"), and Enterprise Corp, a Delaware corporation ("Client").

1. SERVICES AND PROVISION
Provider shall use commercially reasonable efforts to render the Subscription Services specified in an executed Order Form. Notwithstanding anything to the contrary herein, Provider reserves the right, in its sole and absolute discretion, to modify, update, deprecate, or suspend any functionality or API endpoints of the Subscription Services at any time without prior written notice to Client.

2. PAYMENT TERMS AND AUTOMATIC RENEWAL
Client shall pay all fees specified in applicable Order Forms. All payment obligations are non-cancelable and fees paid are strictly non-refundable. Upon expiration of the Initial Term, this Agreement and all Order Forms shall automatically renew for successive additional terms of twelve (12) months each (each a "Renewal Term"), unless Client provides unconditional written notice of non-renewal at least ninety (90) days prior to the expiration of the then-current term. Provider reserves the right to increase fees by up to fifteen percent (15%) annually upon commencing any Renewal Term.

3. INTELLECTUAL PROPERTY RIGHTS AND DATA OWNERSHIP
As between the parties, Provider retains exclusive ownership of all right, title, and interest, including all Intellectual Property Rights, in and to the Services, underlying algorithms, analytics data, feedback, and derived telemetry. Client grants to Provider a perpetual, irrevocable, royalty-free, worldwide, transferable, and sublicensable license to use, aggregate, analyze, and create derivative works from any data, telemetry, or content processed through the Services.

4. LIMITATION OF LIABILITY
IN NO EVENT SHALL PROVIDER'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), OR UNDER ANY OTHER THEORY OF LIABILITY, EXCEED THE TOTAL AMOUNT PAID BY CLIENT HEREUNDER IN THE THREE (3) MONTHS PRECEDING THE FIRST INCIDENT GIVING RISE TO LIABILITY. IN NO EVENT SHALL PROVIDER BE LIABLE FOR ANY CONSEQUENTIAL, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR LOST PROFIT DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY THEREOF.

5. INDEMNIFICATION BY CLIENT
Client shall defend, indemnify, and hold harmless Provider and its officers, directors, employees, and agents against any third-party claims, suits, actions, losses, damages, or costs (including attorneys' fees) arising out of or relating to: (a) Client Data; (b) Client's breach of Section 2 or Section 3; or (c) Client's use of the Services in violation of applicable laws. Provider shall have no indemnification obligations whatsoever to Client.

6. TERMINATION FOR CONVENIENCE
Provider may terminate this Agreement or any Order Form for convenience at any time upon thirty (30) days' written notice to Client without penalty or refund of prepaid fees. Client shall have no right to terminate this Agreement for convenience.

7. GOVERNING LAW AND MANDATORY ARBITRATION
This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of law principles. Any dispute arising out of or relating to this Agreement shall be settled exclusively by final, binding arbitration administered by JAMS in Wilmington, Delaware. CLIENT HEREBY WAIVES ANY RIGHT TO TRIAL BY JURY OR CLASS ACTION LITIGATION.`,
    clauses: [
      {
        id: "c1",
        title: "Section 1: Service Modifications",
        category: "Scope of Service",
        severity: "medium", // low, medium, high
        rawText: "Notwithstanding anything to the contrary herein, Provider reserves the right, in its sole and absolute discretion, to modify, update, deprecate, or suspend any functionality or API endpoints of the Subscription Services at any time without prior written notice to Client.",
        simplified: "The vendor can change, break, or turn off features or APIs at any time without giving you advance notice.",
        impact: "High operational risk. Your technical integrations could fail suddenly if features are changed without warning.",
        loopholes: "No minimum SLA or feature-deprecation warning period specified.",
        recommendation: "Require at least 30 to 60 days advance written notice before deprecating core features or breaking APIs.",
        fairDraft: "Provider shall provide Client with at least sixty (60) days advance written notice prior to deprecating or materially altering any core functionality or API endpoint of the Services."
      },
      {
        id: "c2",
        title: "Section 2: Auto-Renewal & Non-Refundable Fees",
        category: "Billing & Term",
        severity: "high",
        rawText: "All payment obligations are non-cancelable and fees paid are strictly non-refundable. Upon expiration of the Initial Term, this Agreement shall automatically renew for successive additional terms of 12 months, unless Client provides unconditional written notice of non-renewal at least 90 days prior... Provider reserves the right to increase fees by up to 15% annually.",
        simplified: "You must give a 90-day notice before renewal to stop automatic 1-year renewals, payments are non-refundable, and prices can jump 15% every year.",
        impact: "Financial trap risk. Missing the 90-day window locks you into another paid year with an automatic 15% price hike.",
        loopholes: "Provider is not required to notify you before the 90-day cancellation deadline.",
        recommendation: "Reduce notice period to 30 days, cap annual price increases at CPI or 3-5%, and mandate a 30-day renewal reminder email.",
        fairDraft: "This Agreement shall automatically renew unless either party provides written notice of non-renewal at least thirty (30) days prior to term end. Any annual fee increase shall be capped at a maximum of 3% or the annual CPI rate."
      },
      {
        id: "c3",
        title: "Section 3: IP Rights & Perpetual Data License",
        category: "Intellectual Property",
        severity: "high",
        rawText: "Client grants to Provider a perpetual, irrevocable, royalty-free, worldwide, transferable, and sublicensable license to use, aggregate, analyze, and create derivative works from any data, telemetry, or content processed through the Services.",
        simplified: "The vendor gets a permanent, forever-free license to keep, use, transform, and monetize your company's data and content.",
        impact: "Confidentiality & Data Privacy hazard. Your proprietary data could be used to train vendor models or shared with third parties.",
        loopholes: "'Data processed through the Services' is overly broad and does not exclude proprietary confidential info.",
        recommendation: "Limit data usage strictly to aggregated, anonymized metadata necessary to operate the service during the active term.",
        fairDraft: "Client grants Provider a limited, non-exclusive license to process Client Data solely to the extent necessary to provide the Services. Provider may use anonymized, aggregated telemetry solely for service optimization."
      },
      {
        id: "c4",
        title: "Section 4: Unilateral Liability Cap",
        category: "Liability & Damages",
        severity: "high",
        rawText: "IN NO EVENT SHALL PROVIDER'S AGGREGATE LIABILITY... EXCEED THE TOTAL AMOUNT PAID BY CLIENT HEREUNDER IN THE THREE (3) MONTHS PRECEDING THE FIRST INCIDENT... IN NO EVENT SHALL PROVIDER BE LIABLE FOR CONSEQUENTIAL, INDIRECT... OR LOST PROFIT DAMAGES.",
        simplified: "If the vendor causes a massive system failure or data leak, the maximum money you can recover is capped at just 3 months of fees.",
        impact: "Asymmetric risk exposure. Major outages or breaches could cost your company millions, but vendor liability is tiny.",
        loopholes: "Cap applies even for gross negligence, data breaches, or breach of confidentiality.",
        recommendation: "Increase liability cap to 12-24 months of fees, and create standard carve-outs (uncapped or higher cap) for data breaches and confidentiality breaches.",
        fairDraft: "Neither party's liability shall exceed the total fees paid or payable by Client under this Agreement in the twelve (12) months preceding the incident. Provided, however, that liability for breach of confidentiality or data protection shall be capped at 3x the annual fee."
      },
      {
        id: "c5",
        title: "Section 5: One-Sided Indemnification",
        category: "Indemnification",
        severity: "high",
        rawText: "Client shall defend, indemnify, and hold harmless Provider... against any third-party claims... Provider shall have no indemnification obligations whatsoever to Client.",
        simplified: "You must cover all vendor legal costs if a third party sues, but the vendor offers ZERO legal defense if someone sues you for IP infringement caused by their software.",
        impact: "Critical risk. If the vendor's software infringes another company's patent, you have to defend yourself out of pocket.",
        loopholes: "Provider is completely immune from IP infringement claims.",
        recommendation: "Add mutual indemnification, requiring the Provider to defend Client against third-party IP infringement claims.",
        fairDraft: "Provider shall defend and indemnify Client against any third-party claims alleging that the Subscription Services infringe or misappropriate any valid United States patent, copyright, or trade secret."
      }
    ]
  },

  mutual_nda: {
    id: "mutual_nda",
    title: "Standard Mutual Non-Disclosure Agreement (NDA)",
    category: "Confidentiality",
    parties: "Apex Innovations LLC & Strategic Partners Inc.",
    effectiveDate: "2026-03-01",
    legaleseDensity: 52,
    estReadingTime: "10 mins",
    simplifiedReadingTime: "2 mins",
    rawText: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is made as of March 1, 2026, by and between Apex Innovations LLC and Strategic Partners Inc.

1. PURPOSE OF DISCLOSURE
The parties wish to explore a potential business relationship ("Purpose") and in connection therewith may disclose to each other confidential technical, commercial, and financial information.

2. CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public information disclosed by one party ("Disclosing Party") to the other party ("Receiving Party"), whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to protect Confidential Information using the same degree of care it uses for its own confidential information of like nature, but not less than reasonable care, and shall not disclose Confidential Information to any third party except to its employees, advisors, and contractors who need to know such information for the Purpose.

4. EXCLUSIONS FROM CONFIDENTIALITY
Confidential Information does not include information that: (a) is or becomes publicly known through no breach of this Agreement; (b) was already known to Receiving Party prior to disclosure; (c) is independently developed without reference to Disclosing Party's Confidential Information; or (d) is required to be disclosed by applicable law or court order.

5. DURATION OF OBLIGATIONS
The obligations of confidentiality under this Agreement shall survive for a period of three (3) years from the date of disclosure, except for trade secrets which shall remain confidential in perpetuity.`,
    clauses: [
      {
        id: "nda_1",
        title: "Section 2: Definition of Confidential Info",
        category: "Definitions",
        severity: "low",
        rawText: "Confidential Information means all non-public information designated as confidential or that reasonably should be understood to be confidential.",
        simplified: "Anything private shared between parties that is marked confidential (or obviously secret) is protected.",
        impact: "Balanced and standard definition.",
        loopholes: "Oral disclosures should ideally be confirmed in writing within 30 days.",
        recommendation: "Standard clean clause. Optional: add 30-day oral confirmation requirement.",
        fairDraft: "Confidential Information includes written materials designated as confidential, and oral disclosures confirmed in writing within 30 days of disclosure."
      },
      {
        id: "nda_2",
        title: "Section 5: 3-Year Confidentiality Term",
        category: "Duration",
        severity: "low",
        rawText: "Obligations of confidentiality shall survive for a period of three (3) years from disclosure, except trade secrets which remain confidential in perpetuity.",
        simplified: "Secrets must be kept safe for 3 years after sharing. Trade secrets stay protected forever.",
        impact: "Fair standard term for standard business discussions.",
        loopholes: "Ensure trade secrets are clearly tagged as trade secrets.",
        recommendation: "Acceptable standard provision.",
        fairDraft: "Obligations shall survive for three (3) years post-disclosure, with trade secret protections continuing as long as information qualifies as a trade secret under law."
      }
    ]
  }
};

export const CONTRACT_COMPARISONS = [
  {
    id: "vendor_nda_comparison",
    title: "Standard NDA vs. Heavy Vendor NDA",
    docA_Name: "Standard Balanced NDA (Your Draft)",
    docB_Name: "Vendor Modified NDA (Their Counter-Draft)",
    overallRiskDelta: "High Risk Shift to Vendor",
    diffSummary: [
      {
        clause: "Definition of Confidential Information",
        status: "modified", // added, deleted, modified
        riskLevel: "medium",
        docA_Text: "Mutual definition protecting both parties' proprietary code, business plans, customer lists, and financial data.",
        docB_Text: "Definition restricted strictly to Vendor's marked disclosures. Excludes Client's verbal and unmarked communications.",
        plainMeaning: "The vendor changed the definition so ONLY their secrets are protected, while your confidential information is left unprotected unless specifically stamped.",
        impact: "One-sided confidentiality exposure."
      },
      {
        clause: "Non-Solicitation of Employees",
        status: "added",
        riskLevel: "high",
        docA_Text: "[Clause Not Present in Standard NDA]",
        docB_Text: "Client agrees not to hire, solicit, or engage any employee or contractor of Vendor during the agreement term and for 2 years thereafter. Liquidated damages equal 200% of employee annual salary.",
        plainMeaning: "Vendor slipped in a strict non-poach clause prohibiting you from hiring any of their engineers for 2 years, with heavy financial penalties.",
        impact: "Restricts hiring capabilities; potential legal liability."
      },
      {
        clause: "Governing Jurisdiction & Venue",
        status: "modified",
        riskLevel: "high",
        docA_Text: "Governed by Delaware law, neutral virtual arbitration.",
        docB_Text: "Governed by the laws of London, UK, with exclusive jurisdiction in English Courts.",
        plainMeaning: "Vendor shifted litigation venue across international borders to London, making legal defense extremely expensive for US-based clients.",
        impact: "Prohibitive litigation costs if a legal dispute arises."
      },
      {
        clause: "Term & Survival",
        status: "modified",
        riskLevel: "low",
        docA_Text: "5 years survival of confidentiality obligations.",
        docB_Text: "1 year survival of confidentiality obligations.",
        plainMeaning: "Vendor reduced protection duration from 5 years down to 1 year.",
        impact: "Confidential information becomes public/unprotected after just 12 months."
      }
    ]
  }
];

export const LANGUAGES = [
  { code: "en", name: "English 🇺🇸" },
  { code: "es", name: "Spanish (Español) 🇪🇸" },
  { code: "hi", name: "Hindi (हिंदी) 🇮🇳" },
  { code: "fr", name: "French (Français) 🇫🇷" },
  { code: "de", name: "German (Deutsch) 🇩🇪" },
  { code: "ja", name: "Japanese (日本語) 🇯🇵" },
  { code: "zh", name: "Chinese (中文) 🇨🇳" }
];

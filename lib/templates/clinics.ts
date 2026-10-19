import { BusinessInput, PricingBreakdown } from "../types";
import { formatCurrency } from "../utils";
import { generateBaseAgentDirectives, generateObjectionHandling, TemplateResult } from "./basePrompts";

export function generateClinicsTemplate(input: BusinessInput, pricing: PricingBreakdown): TemplateResult {
  const serviceItems = input.keyServices.length > 0
    ? input.keyServices.map((s) => `- ${s}`).join("\n")
    : "- Comprehensive Consultations & Diagnostics\n- Specialized Treatment Protocols\n- Preventive & Restorative Care";

  const systemPrompt = `# SYSTEM INSTRUCTION: Next.js Production Build for ${input.businessName}
${generateBaseAgentDirectives(input)}

### Niche Persona: Healthcare & Medical Clinics
Target Business: ${input.specificType}
Location: ${input.location}

### Specific Healthcare Functional Requirements:
1. **Trust-Driven Clinical Authority Layout**:
   - Clean, reassuring aesthetic with high visual contrast and calm blue/slate/emerald accents.
   - Doctor & clinical staff credentials, board certifications, and university affiliations displayed prominently.
2. **Patient Intake & Consultation Funnel**:
   - Multi-step appointment request form capturing Symptoms/Reason for Visit, Preferred Date/Time, and Insurance Provider.
   - Prominent HIPAA confidentiality and data privacy disclaimers.
3. **Emergency / Same-Day Consultation Floating Bar**:
   - Sticky mobile bar:
     - [Schedule Consultation / Book Exam] (Primary CTA)
     - [Emergency Call: tel:...] (Urgent red/amber accent)
     - [Find Clinic / Directions]
4. **Insurance & Financing Badges**:
   - Logos of major accepted insurance carriers, FSA/HSA eligibility badges, and patient financing options.
5. **Structured Data Implementation**:
   - MedicalClinic, Dentist, or MedicalBusiness JSON-LD schema with \`medicalSpecialty\`, \`availableService\`, \`openingHoursSpecification\`, \`telephone\`, and \`address\`.

### Component Directory Blueprint:
\`\`\`
components/
├── navigation/ClinicNavbar.tsx (Authoritative header with phone number & Request Appointment CTA)
├── hero/ClinicHero.tsx (Reassuring patient-first hero with direct appointment trigger)
├── treatments/ProcedureCatalog.tsx (Categorized clinical treatments with indications & FAQs)
├── doctors/PractitionerDirectory.tsx (Physician bio cards, credentials & accolades)
├── insurance/InsuranceCarrierGrid.tsx (Accepted insurances & payment plan explanations)
├── intake/AppointmentRequestModal.tsx (Multi-step confidential booking workflow)
└── footer/ClinicFooter.tsx (HIPAA statement, clinic hours, emergency guidance, map link)
\`\`\`
`;

  const siteMapMarkdown = `# Production Site Roadmap: ${input.businessName}
**Niche**: Clinical & Healthcare (${input.specificType})  
**Target Market**: ${input.location}  
**Architecture**: 5-Page High-Conversion Next.js Architecture

---

## 1. Five-Page Structured Architecture

### Page 1: \`/index\` (Home / Practice Overview)
- **Hero Section**: Reassuring clinical headline, patient satisfaction score (4.9★ from 300+ Google Reviews), and "Request Appointment" CTA.
- **Emergency / Urgent Consultation Bar**: Direct click-to-call for patients with urgent issues or toothaches/injuries.
- **Core Clinical Services Overview**: Clear grid of high-demand treatments.
- **Insurance & Financing Ticker**: Marquee of accepted dental/medical insurance networks and HSA/FSA cards.
- **Patient Testimonials**: Video or text reviews focusing on gentle care, short wait times, and expert staff.

### Page 2: \`/treatments\` (Procedures & Care Guides)
- **Specialty Service Explorer**: Detailed explanations of procedures, who they are for, expected recovery, and benefits.
- **Technology & Equipment Showcase**: Highlights of modern low-radiation X-rays, 3D imaging, or laser equipment building modern trust.
- **Direct Treatment Booking**: Dedicated CTA on each treatment page to request a specific consultation.

### Page 3: \`/doctors\` (Meet the Physicians & Team)
- **Clinical Profiles**: Education, residency, board certifications, continuous education, and years in practice.
- **Philosophy of Care**: Doctor's personal note to anxious patients explaining pain-free techniques.
- **Professional Accreditations**: ADA, AMA, or relevant state medical association badges.

### Page 4: \`/patients\` (New Patient Center & Financing)
- **Downloadable / Online Intake Forms**: Pre-appointment paperwork saving 20 minutes in waiting room.
- **Insurance & Payment Options**: Direct breakdown of covered networks, out-of-pocket pricing, and 0% financing partners.
- **What to Expect on Your First Visit**: Step-by-step visual roadmap from arrival to consultation.

### Page 5: \`/contact\` (Clinic Hours, Location & Emergency)
- **Interactive Google Maps**: Turn-by-turn navigation with dedicated parking garage notes.
- **Emergency Contact Guidance**: Clear protocol for what to do after business hours.
- **Appointment Request Form**: Seamless form with automated confirmation text message.

---

## 2. Features & Technical Specification Matrix

| Feature | Implementation Specification | Conversion Impact |
| :--- | :--- | :--- |
| **Emergency Tap-to-Call Sticky Bar** | Mobile fixed footer with high-contrast emergency dialer | Converts urgent high-value patients within 15 seconds of search |
| **MedicalClinic JSON-LD Schema** | Embedded structured data with \`medicalSpecialty\` | Ranks at the very top of local "doctor near me" queries |
| **Digital New-Patient Intake** | Pre-fillable secure forms | Cuts clinical desk admin overhead by 40% and reduces no-shows |
| **Insurance Verification Badge** | Verified network list with instant search | Eliminates the #1 objection for booking medical consultations |
| **Google Review Verified Feed** | Schema-backed 5-star aggregate badge | Crucial trust anchor for patients switching from previous provider |
`;

  const pitchScriptMarkdown = `# Client Pitch Deck & Acquisition Script: ${input.businessName}
**Niche**: Clinical & Healthcare (${input.specificType})  
**Target Market**: ${input.location}  

---

## 1. Three-Tier Value Pricing Matrix

| Tier Name | Price | Core Deliverables | Ideal Client Scenario |
| :--- | :--- | :--- | :--- |
| **1. Modern Practice Foundation** | **${formatCurrency(pricing.floorPrice)}** (Floor) | 1-Page Authority Landing Page, Emergency Call button, Core Procedures List, Insurance Badges, 7-day turnaround | Solo practitioner opening a satellite office or replacing an outdated 2012 website |
| **2. Clinical Growth & Patient Intake Hub** | **${formatCurrency(pricing.targetPrice)}** (Target - Recommended) | Complete 5-Page Next.js Architecture, Multi-Step Appointment Request Funnel, Doctor Profiles, Insurance Directory, MedicalClinic Schema | Established clinic looking to attract 15-25 new insured patients every month |
| **3. Premier Clinic Authority Suite** | **${formatCurrency(pricing.anchorPrice)}** (Anchor) | Everything in Growth Hub + Online Digital Intake Form Integration, Patient Video Testimonial Showcase, Local Map Pack SEO Campaign, Speed Guarantee (<1s) | Multi-practitioner clinic or competitive medspa looking to become the #1 rated provider in their area |

---

## 2. Cold Outreach / Phone Script (Call at 8:30 AM or 12:30 PM)

**Setting**: Speak with the Practice Manager or Office Administrator.

> **Agency Pitcher:**
> *"Hi [Practice Manager Name], my name is [Your Name]. I'm a healthcare web developer based here in [City/State].*
> 
> *I recently reviewed dental and clinic search volume in ${input.location}. Right now, a single new patient in your specialty has an average lifetime value between $1,500 and $4,500.*
> 
> *When patients search for '${input.specificType} in ${input.location}' on their phones—especially when they have an urgent concern—they look for immediate phone access, whether you accept their insurance, and proof of modern care.*
> 
> *Right now, many clinics in our area lose potential patients because their websites are slow or non-responsive, or because their contact forms don't give immediate confirmation.*
> 
> *We developed a modern clinical website framework designed specifically for ${input.businessName} with an emergency tap-to-call bar and an insurance-matching consultation funnel.*
> 
> *If this brought in just 2 additional new patients this month, it completely pays for itself. I put together a 90-second video walkthrough showing how this compares to other practices in ${input.location}. What is the best email to send this walkthrough to?"*

---

## 3. The Anchor-to-Target Closing Sequence

> **Agency Pitcher:**
> *"Our full-service Premier Clinic Authority Suite is typically **${formatCurrency(pricing.anchorPrice)}** for regional multi-doctor practices.*
> 
> *However, for ${input.businessName}, our primary objective right now is to streamline patient intake and ensure your phone rings with qualified, insured patients.*
> 
> *Our **Clinical Growth & Patient Intake Hub** at **${formatCurrency(pricing.targetPrice)}** delivers the entire 5-page patient-centered website, the mobile emergency bar, full Local Medical Schema for Google Maps, and your new-patient booking funnel.*
> 
> *With just one or two new patient appointments, the entire platform provides a 100% return on investment. Can we send over the kickoff agreement today and have you live before the 1st of the month?"*

---

${generateObjectionHandling(pricing)}
`;

  return { systemPrompt, siteMapMarkdown, pitchScriptMarkdown };
}


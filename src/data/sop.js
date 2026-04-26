export const POLICY_LOG = [
  {
    date: "July 1, 2025",
    title: "Bed Assignment Updates",
    body: "249–C252 reassigned to CVICU. C243–C248 reassigned to IMCU. IMCU patients in GEO beds transferred to 2CE. GEO beds previously IMCU converted back to EDO.",
    isNew: true,
  },
  {
    date: "May 30, 2025",
    title: "Direct to OR Add-On / Cath Lab Process Change",
    body: "OR creates FIN and calls Transfer Center for Direct to OR add-ons. RC no longer creates FIN but continues to call ER/Main for notification. Includes Cath Lab patients.",
    isNew: true,
  },
  {
    date: "May 1, 2025",
    title: "MPV Bed Assignment Shift & CCU Opening",
    body: "BCs now handle MPV bed assignments, yellow dots, ED admits, and floor transfers. RC keeps IFTs, silhouettes, and direct admits. CCU opened rooms 476–481. 4 Central split: Left = 10-bed CCU (ICU level), Right = 20-bed IMCU. CCU patients = ICU acuity by default.",
    isNew: true,
  },
  {
    date: "April 22, 2025",
    title: "Teams Migration (Skype Replacement)",
    body: "Skype replaced by Microsoft Teams effective May 1. Log in to Teams app to ensure access.",
    isNew: false,
  },
  {
    date: "March 4, 2025",
    title: "Phase Out Paper Slips — E-Bridge Soft Start",
    body: "Transitioning from paper slips to E-Bridge process for FIN generation requests. Soft go-live began 3/11/25. Face sheet from non-Northside facilities remains required.",
    isNew: false,
  },
  {
    date: "January 10, 2025",
    title: "Discharge Time Clarification for STAR",
    body: "Use actual physical discharge times, not nursing discharge summaries. Ensures STAR accuracy and billing compliance.",
    isNew: false,
  },
  {
    date: "November 19, 2024",
    title: "RFA/PSO Process Change — Transfer Center",
    body: "TC now creates both RFA and PSO after FIN creation for Direct Admits and STEMI patients. Automates silhouette creation as LMS instead of LDA. RC updates comments only. Example comment: TX NSA 5N.",
    isNew: false,
  },
  {
    date: "November 6, 2024",
    title: "AHIQA Folder Organization Change",
    body: "AHIQA folders now organized by employee name instead of date. Staff reminded to shred outdated documents.",
    isNew: false,
  },
  {
    date: "October 28, 2024",
    title: "OBS to IPL Acuity Update",
    body: "When OBS Intermediate changes to IPL Acute, RC updates STAR acuity accordingly. IFT not required — careful review needed to avoid placement errors.",
    isNew: false,
  },
  {
    date: "April 15, 2024",
    title: "Glancy Patient Transfer Responsibility Clarification",
    body: "Lawrenceville RC should NOT handle Glancy patients' FINs. Glancy or Duluth RC must manage these transfers. Lawrenceville can flip Glancy accounts to OPG only.",
    isNew: false,
  },
  {
    date: "January 18, 2024",
    title: "Annex Direct Admit Labels Process",
    body: "Annex now accepts Direct Admits. RC prints labels via EasyWeb to Annex printers PMANNNS1/PMANNNS2. Secretaries armband patients and leave labels for nurses.",
    isNew: false,
  },
  {
    date: "November 20, 2023",
    title: "Room Assignment Phase 2 Rollout",
    body: "BC gives floor only; RC selects room based on unit numbers. ICU remains exception.",
    isNew: false,
  },
  {
    date: "July 5, 2023",
    title: "New EMS Transport Parking Location",
    body: "New EMS Transport Parking area opened, replacing former non-emergent EMS area at North Loading Dock. Access: badge or pin pad (code: 4911). For non-emergent EMS transfers/discharges only.",
    isNew: false,
  },
];

export const SECTIONS = [
  {
    id: "overview",
    group: "Getting Started",
    label: "Overview & Your Role",
    icon: "🏥",
    content: `
You are the central hub for patient flow management — ensuring seamless coordination between departments and accurate patient placement throughout the facility.

**Key Systems Used Daily:** STAR · MPV (McKesson Visibility) · Cerner/FirstNet · RevRunner · One Content · Care Organizer · Microsoft Teams

**Acuity Levels:**
- 🟢 Green = Acute Care
- 🟡 Yellow = IMCU / Intermediate
- 🔴 Red = ICU / Critical Care
- 🟠 Orange = Annex

Remove acuity in MPV once the patient arrives at their assigned location. CCU patients = ICU acuity by default (effective 5/1/25).
    `,
    steps: null,
  },
  {
    id: "cheatsheet",
    group: "Getting Started",
    label: "Quick Cheat Sheet",
    icon: "⚡",
    content: null,
    cheatItems: [
      { title: "Daily Reports", items: ["1st Shift: Day Surg/OR (by 7 AM)", "2nd Shift: Cath Lab / ARU", "3rd Shift: G-Cath Lab (by 6 AM)"] },
      { title: "Common SNCs", items: ["101 – Type Change", "20 – Not Present", "1531 – CM Type Change", "1233 – Blank/Admit Complete", "1722 – Ref to Audit"] },
      { title: "Acuity Colors", items: ["Green = Acute Care", "Yellow = IMCU", "Red = ICU / Critical Care", "Orange = Annex"] },
      { title: "Audit Log", items: ["MPV → Admin Tools → Audit Log", "Attribute: ptar = when PTARed", "Removed ptar = RC finished", "Confirm in STAR if unclear"] },
      { title: "IFT Transfers", items: ["Change acuity per Level of Care", "Add comment before diagnosis", "No triangle if same level", "Remove silhouette on lateral Tx"] },
      { title: "Backdating Exceptions", items: ["Use PSO time (not E) for:", "Medicare / Medicare Advantage", "Kaiser · Tricare", "Blue Cross Blue Shield"] },
      { title: "Daily Tasks (All Shifts)", items: ["Respond to emails (Teams)", "Clear halls / EOS report", "Clear AHIQA before shift end", "Update MPV & FirstNet"] },
      { title: "CCU Updates (5/1/25)", items: ["Rooms 476–481 = ICU acuity", "249–C252 = CVICU", "C243–C248 = IMCU", "BCs now handle ED admits & yellow dots"] },
    ],
  },
  {
    id: "daily",
    group: "Getting Started",
    label: "Daily Task Expectations",
    icon: "📅",
    content: `**All Shifts:** Respond emails · Clear halls · AHIQA · MPV updates · Answer phones · Update FirstNet

**As of 5/1/25:** BCs handle MPV bed assignments, yellow dots, ED admits, and floor transfers. RC keeps IFTs, silhouettes, and direct admits.

**Facesheet Tracking:** Note any facesheet printed for Noah's team in your daily EOS email.`,
    steps: [
      { title: "Admits — Notify ED Team Lead", detail: "Notify the ED Team Lead or Supervisor of patient arrival and account number upon confirmation.", tags: ["STAR", "FirstNet"] },
      { title: "AHIQA — Clear before end of shift", detail: "Review and dispute AHIQA items as needed. Must be completed before your shift ends.", tags: [] },
      { title: "Care Alerts / Orders", detail: "Monitor for inpatient, observation, outpatient, surgery, and transfer needs.", tags: ["STAR", "MPV"] },
      { title: "Emails — Use Microsoft Teams", detail: "Respond to all emails received during your shift. Skype replaced by Teams as of May 1, 2025.", tags: [] },
      { title: "Clear Halls", detail: "Check, clear, or note hall status in your End of Day (EOS) report.", tags: [] },
      { title: "MPV Updates", detail: "Transfer PTARs, create reservations/requests, update comments and acuity, note dirty rooms to BCs.", tags: ["MPV"] },
      { title: "Phone Calls", detail: "Answer promptly and return missed calls. Log in to Avaya J179 and press Auto In.", tags: [] },
      { title: "FirstNet Updates", detail: "Update bed assignment and disposition in FirstNet as needed.", tags: ["FirstNet"] },
    ],
  },
  {
    id: "preadmits",
    group: "Patient Flow",
    label: "Handling Pre-Admits",
    icon: "📋",
    content: "Pre-registration and advance planning for incoming patients.",
    steps: [
      { title: "Receive call from Transfer Line", detail: "Transfer Coordinator completes hard copy pre-admit slip.", tags: [] },
      { title: "Create PRL account in STAR", detail: "Enter all patient information into the system.", tags: ["STAR"] },
      { title: "Verify insurance in RevRunner", detail: "If not accepted, document in STAR and notify the Bed Coordinator immediately.", tags: ["RevRunner"] },
      { title: "File pre-admit slip by Date of Admit", detail: "Organize the hard copy slip chronologically.", tags: [] },
      { title: "On day of procedure — create Bed Request", detail: "Create Bed Request in Visibility based on patient type.", tags: ["MPV"] },
    ],
  },
  {
    id: "directadmits",
    group: "Patient Flow",
    label: "Processing Direct Admits",
    icon: "🏥",
    content: `**RFA/PSO Update (11/19/24):** TC now creates both RFA and PSO after FIN creation. Automates silhouette creation as LMS. RC updates comments only. Example comment: TX NSA 5N. TC sends Teams message to confirm silhouette is ready.

**NSD Fall-Off:** If RFA/PSO issued too early and patient falls off MPV, NSD RC reinstates and TC creates temporary silhouette.`,
    steps: [
      { title: "Physician calls Transfer Line", detail: "TC completes the slip and passes to BC/RC.", tags: [] },
      { title: "Create PRL account in STAR", detail: "Enter all patient information.", tags: ["STAR"] },
      { title: "Provide charge nurse number to sending office", detail: "Charge nurse performs nurse-to-nurse report. They contact BC if admission seems inappropriate.", tags: [] },
      { title: "If no bed available", detail: "Notify physician. Patient may wait at home or office. Document delay in Visibility.", tags: ["MPV"] },
      { title: "When bed is available", detail: "Assign bed in STAR, update Visibility. Registration may be completed bedside.", tags: ["STAR", "MPV"] },
    ],
  },
  {
    id: "edadmits",
    group: "Patient Flow",
    label: "ED Admissions",
    icon: "🚑",
    content: `**Backdating:** Use E (earliest) for all ED admits EXCEPT Medicare, Medicare Advantage, Kaiser, Tricare, Blue Cross Blue Shield → use PSO time instead.`,
    steps: [
      { title: "ED clinician places Request for Admit (RFA)", detail: "This triggers a notification in Visibility.", tags: ["MPV"] },
      { title: "BC documents level of care and unit type", detail: "", tags: [] },
      { title: "If no bed is available", detail: "Patient remains in ER. RC monitors and updates delay notes in Visibility.", tags: [] },
      { title: "When bed is available", detail: "Assign bed in STAR, mark Bed Ready in Visibility. ED prepares patient for transport.", tags: ["STAR", "MPV"] },
    ],
  },
  {
    id: "surgery",
    group: "Patient Flow",
    label: "Surgery / Cath Lab Admits",
    icon: "🔬",
    content: `**Direct to OR Add-On (5/30/25):** RC no longer creates FIN. OR calls TC, TC notifies RC. RC creates FIN (PRL/SURL/SUR/R52). Call OR at 24660. When patient arrives, flip to OSL without assigning a room.

**Duluth STEMI labels:** Print to Cath Lab printer LJ 8193.`,
    steps: [
      { title: "Clinician places Physician's Service Order (PSO)", detail: "", tags: [] },
      { title: "BC reviews patient info", detail: "Documents level of care and unit needed.", tags: [] },
      { title: "RC assigns bed in Visibility", detail: "Updates STAR with patient type, service, location, and SNCs.", tags: ["STAR", "MPV"] },
      { title: "PACU/ARU prepares patient for transport", detail: "Once bed is assigned and confirmed ready.", tags: [] },
    ],
  },
  {
    id: "discharges",
    group: "Patient Flow",
    label: "Discharges",
    icon: "🚪",
    content: `**Discharge time (1/10/25):** Use actual physical discharge times, not nursing discharge summary times.

**Cancel Discharge:** Cerner → Appbar Prod → A → Customize → Options tab → unclick Always On Top → Float → Large Buttons → Buttons tab → Conversation Launcher → OK. Then Conversation icon → Cancel Discharge (Red X). Confirm correct FIN on ER board.`,
    steps: [
      { title: "Clinician places discharge order", detail: "", tags: [] },
      { title: "RC discharges patient in Visibility", detail: "Enter disposition, time, and physician name.", tags: ["MPV"] },
      { title: "EVS is notified automatically", detail: "Room is queued for cleaning.", tags: [] },
      { title: "If discharge not completed after 3 hours", detail: "BC calls unit, documents reason, and escalates if unresolved.", tags: [] },
    ],
  },
  {
    id: "intra",
    group: "Transfers",
    label: "Intra-Facility Transfers",
    icon: "🔄",
    content: `**OBS to IPL (10/28/24):** When OBS Intermediate changes to IPL Acute, RC updates STAR acuity. IFT not required — careful review needed to avoid placement errors.`,
    steps: [
      { title: "Change acuity based on Level of Care in transfer order", detail: "", tags: ["MPV"] },
      { title: "Add a front comment with Level of Care", detail: "Do NOT delete existing diagnosis — type your note in front of it.", tags: [] },
      { title: "No triangle needed for lateral transfers", detail: "Silhouette is removed on lateral transfers. Patients needing specialty beds (5N/6N) remain on board.", tags: [] },
      { title: "If no bed available", detail: "Patient stays on current unit. RC monitors and updates acuity as needed.", tags: [] },
    ],
  },
  {
    id: "inter",
    group: "Transfers",
    label: "Inter-Facility Transfers",
    icon: "🏨",
    content: `**Glancy patients (4/15/24):** Lawrenceville RC should NOT handle Glancy patients' FINs. Glancy or Duluth RC must manage these transfers. Lawrenceville can flip Glancy accounts to OPG only.`,
    steps: [
      { title: "Provider enters Transfer To: order in HEO", detail: "Sends care alerts to Room Control and Bed Coordinator/PSC.", tags: [] },
      { title: "RC calls Financial Counselor or ER PAS", detail: "FC in Duluth or ER PAS in trauma area for Lawrenceville.", tags: [] },
      { title: "FC or PAS removes previous site's armband", detail: "New site's armband is placed on the patient.", tags: [] },
      { title: "L'ville BC and Duluth PSC manage MPV", detail: "Either can place holds at either site if needed.", tags: ["MPV"] },
      { title: "Back Dock Arrivals", detail: "RC prepares account/armband/labels. EMS calls RC upon arrival. RC cuts off old armband, replaces with new, provides labels/facesheet.", tags: [] },
    ],
  },
  {
    id: "stemi",
    group: "Transfers",
    label: "STEMI Registration",
    icon: "❤️",
    content: `**Critical:** Any deviation in patient status/type must go through Room Control to update changes in STAR/FirstNet — especially if patient is rerouted into the ER.`,
    steps: [
      { title: "Duluth calls Transfer Center to activate STEMI Alert", detail: "Removes armband from patient before leaving. Prints necessary forms for EMS transfer.", tags: [] },
      { title: "RC creates FIN, prints labels to Cath Lab printer LJ 8193", detail: "TC Coordinator calls ED Flow and EMS Comm room to advise of in-bound STEMI.", tags: ["STAR"] },
      { title: "RC notifies PAS in ED of impending STEMI arrival", detail: "TC alerts RC to arrive patient in STAR once patient lands.", tags: [] },
      { title: "EMS arrives at ED desk and announces arrival", detail: "", tags: [] },
      { title: "ED clinical staff confirms Cath Lab readiness, escorts patient", detail: "", tags: [] },
      { title: "Cath Lab confirms identity (2 identifiers), swaps armband", detail: "Ensures Duluth armband removed, applies Lawrenceville armband.", tags: [] },
    ],
  },
  {
    id: "lifelink",
    group: "Transfers",
    label: "LifeLink Process",
    icon: "💛",
    content: "Organ donation insurance handling — follow all steps in order.",
    steps: [
      { title: "RN or Charge RN notifies MT/US of consent", detail: "", tags: [] },
      { title: "MT/US notifies Room Control", detail: "Call 23824 or email roomcontrol@gwinnettmedicalcenter.org", tags: [] },
      { title: "Room Control emails Audit", detail: "Send to BusinessOfficeAudit@northside.com for charge evaluation before and after death.", tags: [] },
      { title: "Audit Supervisor emails Commercial Supervisor", detail: "To add LifeLink insurance plan and place account on bill hold.", tags: [] },
    ],
  },
  {
    id: "mpv",
    group: "Systems & Tools",
    label: "MPV & Acuity",
    icon: "💻",
    content: `**CCU (5/1/25):** Rooms 476–481 = ICU acuity by default. Downgrade ICU → IMCU: add triangle 2, comment "tx imcu," remove silhouette. IFTs = ICU unless CCU specified.

**Monitoring:** Notify BC when beds are dirty or multiple patients await same floor. Placement priority: Acuity first → then Length of Stay.`,
    steps: [
      { title: "Click patient in MPV", detail: "Navigate to Patient Attributes → Acuity.", tags: ["MPV"] },
      { title: "Select appropriate acuity level", detail: "Green = Acute, Yellow = IMCU, Red = ICU, Orange = Annex.", tags: [] },
      { title: "Remove acuity on arrival", detail: "Patient Attributes → Select No Acuity once patient arrives at assigned location.", tags: [] },
      { title: "Add Comments", detail: "Double-click silhouette or room square → Patient Placement → Update Patient Info → enter comment.", tags: [] },
      { title: "Bed Placement Messages", detail: "Click silhouette/square → Bed Placement Message → Add Message (auto-stamped with time).", tags: [] },
    ],
  },
  {
    id: "bedrequests",
    group: "Systems & Tools",
    label: "Bed Requests & Reservations",
    icon: "🛏️",
    content: `**Room Assignment (11/20/23):** BC gives floor only; RC selects room based on unit numbers. ICU remains the exception.`,
    steps: [
      { title: "In MPV, click the magnifying glass", detail: "Quick Search patient by last name.", tags: ["MPV"] },
      { title: "Select patient → double-click silhouette", detail: "", tags: [] },
      { title: "Check appropriate options in Bed Request screen", detail: "Based on PSO. Always include ACUTE. Click Create Bed Request.", tags: [] },
      { title: "Go to Room Reservations tab", detail: "Select floor and room. Document any verbal changes. Click Close.", tags: [] },
    ],
  },
  {
    id: "roomhold",
    group: "Systems & Tools",
    label: "Placing Rooms on Hold",
    icon: "🔒",
    content: `**Annex (1/18/24):** RC prints labels via EasyWeb to Annex printers PMANNNS1 / PMANNNS2. Secretaries armband patients and leave labels for nurses.`,
    steps: [
      { title: "Click room in Visibility → Hold Room tab", detail: "", tags: ["MPV"] },
      { title: "Select hold type", detail: "Environmental (E), Housekeeping (H), or Reserved (for direct admits).", tags: [] },
      { title: "For direct admits, add comment", detail: "Comment format: TX [facility name]. Click Save Comment.", tags: [] },
      { title: "If no room assigned", detail: 'Note on pre-admit slip: "Unable to place hold."', tags: [] },
    ],
  },
  {
    id: "auditlog",
    group: "Systems & Tools",
    label: "Audit Log Entries",
    icon: "📊",
    content: `**AHIQA Folders (11/6/24):** Now organized by employee name instead of date. Shred outdated documents. Follow Jermaine's scorecard expiration guidance.`,
    steps: [
      { title: "Open MPV twice for side-by-side comparison", detail: "", tags: ["MPV"] },
      { title: "Go to Administration Tools on the toolbar", detail: "", tags: [] },
      { title: "Click Audit Log Entries", detail: "", tags: [] },
      { title: "Choose the same day on both MPVs", detail: "", tags: [] },
      { title: "Set Attribute to ptar", detail: "Shows when secretaries PTARed patients.", tags: [] },
      { title: "Set Removed Attribute to ptar", detail: "Shows when RC finished processing.", tags: [] },
      { title: "Use the time column on the left to compare", detail: "", tags: [] },
      { title: "If times appear inconsistent", detail: "Confirm by reviewing history in STAR.", tags: ["STAR"] },
    ],
  },
  {
    id: "phone",
    group: "Systems & Tools",
    label: "Phone System — Avaya J179",
    icon: "📞",
    content: `**Critical:** No calls will ring until you log in AND press Auto In. Always log out at end of workday.

**Statuses:** Aux-Work (Not Ready) = stepping away, no calls. Auto In = ready for calls. After Call (Work) = wrap-up after call. Log Out = end of day.`,
    steps: [
      { title: "Press Log In on the phone", detail: "You will hear a dial tone.", tags: [] },
      { title: "Enter your agent ID", detail: "", tags: [] },
      { title: "Enter agent ID again as the password", detail: "", tags: [] },
      { title: "Phone defaults to Aux-Work (Not Ready)", detail: "You are not yet receiving calls.", tags: [] },
      { title: "Press Auto In to begin receiving calls", detail: "", tags: [] },
    ],
  },
  {
    id: "snc",
    group: "Reference",
    label: "Standard Note Codes",
    icon: "🏷️",
    content: "If Care Coordination requests a patient type update, complete as requested and document in STAR who made the request (name and department).",
    table: {
      headers: ["Code", "Description"],
      rows: [
        ["0101", "Patient Type Change"],
        ["0157", "OBV with TELE"],
        ["0158", "IP with TELE"],
        ["0159", "OBV without TELE"],
        ["0160", "IP without TELE"],
        ["1233", "Blank / Admit Complete"],
        ["1234", "Blank Admit / Direct Admit"],
        ["1531", "Per Case Management — Patient Type Changed"],
        ["1722", "Referral to Audit from Room Control"],
        ["20", "Patient Not Present"],
      ],
    },
  },
  {
    id: "admcodes",
    group: "Reference",
    label: "Admission Source Codes",
    icon: "📍",
    content: "Critical Access Hospitals (e.g., Morgan Medical Center) fall under code 4 — Transfer from Acute Care. Full list on RC whiteboard.",
    table: {
      headers: ["Code", "Description"],
      rows: [
        ["1", "Non-Healthcare Facility — home or accident scene"],
        ["2", "Clinic Referral — PCP, clinic, or specialist"],
        ["4", "Transfer from Acute Care Hospital"],
        ["5", "Transfer from SNF or Assisted Living"],
        ["6", "Transfer from Other Hospital (rehab, etc.)"],
        ["8", "Court / Law Enforcement Referral"],
        ["9", "Information Not Available"],
        ["10", "Newborn Inborn — born at Northside"],
        ["11", "Newborn Outborn — born outside Northside"],
        ["12", "Transfer from Ambulatory Surgery Center"],
        ["13", "Transfer from Hospice Facility"],
      ],
    },
  },
  {
    id: "patienttypes",
    group: "Reference",
    label: "Patient Types & Abbreviations",
    icon: "🆔",
    content: `**Privacy Patient:** Small x in front of name (e.g., xJONES). If Law Enforcement inquires, contact Public Safety: (2)4590.

**Deceased Patient:** Indicated by EXP. Contact Chaplain: (2)4332 · On Call: 678-372-6095`,
    table: {
      headers: ["Code", "Description"],
      rows: [
        ["ERD / ERL", "Emergency Room (Duluth / Lawrenceville)"],
        ["IPD / IPL", "Inpatient (Duluth / Lawrenceville)"],
        ["IPG", "Inpatient (Glancy)"],
        ["OBD / OBL", "Observation (Duluth / Lawrenceville)"],
        ["OAD / OAL", "Outpatient Assigned a Bed (Duluth / L'ville)"],
        ["OSL / OSD", "Outpatient Surgery (L'ville / Duluth)"],
        ["PRL / PRD", "Preadmission Live (L'ville / Duluth)"],
        ["PSL", "Preadmit Shell (Lawrenceville)"],
        ["QED / QEL", "Quick ER (Duluth / Lawrenceville)"],
        ["CND / CNL", "Cancel Admit (Duluth / Lawrenceville)"],
        ["W / WN", "Women's Pavilion / Women's Pavilion Newborn"],
        ["WINT", "Baby in NICU"],
        ["NEL", "Newborn (Lawrenceville)"],
      ],
    },
  },
  {
    id: "backdating",
    group: "Reference",
    label: "Insurance & Backdating",
    icon: "📆",
    content: "Upon encounter creation, check insurance from transfer sheet or bed board. Load promptly, especially for late evening arrivals. Enter SNCs to prevent Quality Registration errors (e.g., 0020).",
    table: {
      headers: ["Admit Type", "Rule", "Exceptions"],
      rows: [
        ["ED Admits", "Use E (earliest)", "Medicare, Medicare Advantage, Kaiser, Tricare, BCBS → use PSO time"],
        ["Direct Admits", "Always use E", "None"],
        ["Surgery Admits", "Always use E", "None"],
        ["Outpatient to Admit", "Always use E", "None"],
      ],
    },
  },
  {
    id: "duplicatemrn",
    group: "Reference",
    label: "Duplicate MRN Process",
    icon: "🔁",
    content: `**BMT Accounts:** Direct to Barbara Schipani, CC Lynnette South and Kim Gaddy. They forward to BMT Clinical Team to determine which MRN to retain.`,
    steps: [
      { title: "Gather required information", detail: "Today's date · Patient Name · Cross-reference name (if any) · Date of Birth · All MRNs involved.", tags: [] },
      { title: "Email to @Duplicate MRN Notifications", detail: "", tags: [] },
      { title: "Expect resolution within 1–5 business days", detail: "Do NOT resend the request during this window.", tags: [] },
    ],
  },
  {
    id: "sel",
    group: "Reference",
    label: "Flipping SEL Accounts",
    icon: "🔀",
    content: "SEL is not an inpatient type so STAR will not allow bed placement. Use this process to resolve. Keep this in your notes — it may come up again. — Sara Keegan",
    steps: [
      { title: "Revise admission date to current date and save", detail: "", tags: ["STAR"] },
      { title: "Search patient again → go to Admissions", detail: "Check if system now gives option to change patient type to OPL.", tags: [] },
      { title: "If not — cycle patient type multiple times", detail: "Cycle: OPL → PRL → OBL → IPL. Repeat until the option appears.", tags: [] },
      { title: "Disposition as still a patient and bed the patient", detail: "If STAR still won't bed: page Medical Page, place in secondary location 5N, change service to CRD, accept all the way out.", tags: [] },
    ],
  },
];

export const QUICK_FINDER_SCENARIOS = [
  { label: "Patient just arrived from Duluth", sectionId: "inter" },
  { label: "Need to cancel a discharge", sectionId: "discharges" },
  { label: "STEMI alert called", sectionId: "stemi" },
  { label: "Duplicate MRN notification", sectionId: "duplicatemrn" },
  { label: "Direct admit with no bed", sectionId: "directadmits" },
  { label: "Patient type change requested by CM", sectionId: "snc" },
  { label: "SEL account needs to be admitted", sectionId: "sel" },
  { label: "Need to place a room on hold", sectionId: "roomhold" },
  { label: "Organ donation consent received", sectionId: "lifelink" },
  { label: "Audit log discrepancy", sectionId: "auditlog" },
  { label: "New hire first day", sectionId: "overview" },
  { label: "Backdating an ED admit", sectionId: "edadmits" },
  { label: "Phone not ringing", sectionId: "phone" },
  { label: "OBS changing to inpatient", sectionId: "intra" },
  { label: "Pre-admit incoming tomorrow", sectionId: "preadmits" },
  { label: "Surgery patient needs a bed", sectionId: "surgery" },
];

export const SHIFT_CHECKLISTS = {
  "1st": [
    { id: "s1-1", text: "Complete Day Surgery / OR Report (by 7 AM)" },
    { id: "s1-2", text: "Review overnight admissions and discharges" },
    { id: "s1-3", text: "Check bed availability and clean room status in MPV" },
    { id: "s1-4", text: "Process any pending direct admits" },
    { id: "s1-5", text: "Update MPV acuity levels" },
    { id: "s1-6", text: "Notify ED Team Lead of any pending arrivals" },
    { id: "s1-7", text: "Log in to Avaya J179 and press Auto In" },
    { id: "s1-8", text: "Check and respond to Teams emails" },
    { id: "s1-9", text: "Monitor Visibility Board for bed status changes" },
    { id: "s1-10", text: "Clear AHIQA items before end of shift" },
    { id: "s1-11", text: "Document hall statuses in EOS report" },
    { id: "s1-12", text: "Log out of Avaya J179 at end of shift" },
  ],
  "2nd": [
    { id: "s2-1", text: "Complete Cath Lab / ARU Report" },
    { id: "s2-2", text: "Review status board and pending admits" },
    { id: "s2-3", text: "Log in to Avaya J179 and press Auto In" },
    { id: "s2-4", text: "Process pending transfers and direct admits" },
    { id: "s2-5", text: "Check and respond to Teams emails" },
    { id: "s2-6", text: "Update MPV comments and acuity levels" },
    { id: "s2-7", text: "Notify BC of dirty or pending rooms" },
    { id: "s2-8", text: "Monitor discharge completions (>3 hrs = escalate)" },
    { id: "s2-9", text: "Clear halls and note status in EOS report" },
    { id: "s2-10", text: "Clear AHIQA items before end of shift" },
    { id: "s2-11", text: "Log out of Avaya J179 at end of shift" },
  ],
  "3rd": [
    { id: "s3-1", text: "Complete G-Cath Lab Report (by 6 AM)" },
    { id: "s3-2", text: "Log in to Avaya J179 and press Auto In" },
    { id: "s3-3", text: "Review overnight board — admissions and discharges" },
    { id: "s3-4", text: "Process any pending admits or transfers" },
    { id: "s3-5", text: "Update MPV acuity and comments" },
    { id: "s3-6", text: "Check and respond to Teams emails" },
    { id: "s3-7", text: "Monitor Visibility Board for status changes" },
    { id: "s3-8", text: "Clear halls and note status" },
    { id: "s3-9", text: "Clear AHIQA items before end of shift" },
    { id: "s3-10", text: "Prepare EOS report for oncoming shift" },
    { id: "s3-11", text: "Log out of Avaya J179 at end of shift" },
  ],
};

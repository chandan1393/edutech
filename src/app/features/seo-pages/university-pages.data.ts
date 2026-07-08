import { ServicePageData, ServiceFeature, RelatedLink } from './service-pages.data';

const UNI_FEATURES: ServiceFeature[] = [
  { icon: '🎓', title: 'Familiar With Your School', desc: 'Experts who have supported students at this university and know its platform, pacing, and expectations.' },
  { icon: '🔒', title: '100% Confidential', desc: 'Your identity and login stay encrypted, are never shared, and are deleted within 48 hours of completion.' },
  { icon: '⏱️', title: 'Built for Accelerated Terms', desc: 'Many programs here run in 6–8 week blocks. We keep pace so no assignment, quiz, or exam slips.' },
  { icon: '💳', title: 'Pay As You Go', desc: 'Flexible weekly installments through Stripe — you only pay as work is delivered and admin-reviewed.' },
  { icon: '📋', title: 'Admin Quality Review', desc: 'Every submission passes an internal quality check before it reaches your course.' },
  { icon: '📞', title: '24/7 Live Support', desc: 'Real humans reply in under 5 minutes on WhatsApp, any timezone, every day.' },
];

const UNI_LINKS: RelatedLink[] = [
  { label: 'Arizona State University Help', path: '/arizona-state-university-help' },
  { label: 'SNHU Help', path: '/snhu-help' },
  { label: 'WGU Help', path: '/wgu-help' },
  { label: 'Purdue Global Help', path: '/purdue-global-help' },
  { label: 'Liberty University Help', path: '/liberty-university-help' },
  { label: 'University of Phoenix Help', path: '/university-of-phoenix-help' },
  { label: 'Grand Canyon University Help', path: '/grand-canyon-university-help' },
  { label: 'Capella University Help', path: '/capella-university-help' },
  { label: 'Walden University Help', path: '/walden-university-help' },
];

const CORE_LINKS: RelatedLink[] = [
  { label: 'Online Class Help', path: '/online-class-help' },
  { label: 'Take My Online Class', path: '/take-my-online-class' },
  { label: 'Assignment Help', path: '/assignment-help' },
  { label: 'Online Exam Help', path: '/exam-help' },
];

function uniRelated(slug: string, subjectLinks: RelatedLink[]): RelatedLink[] {
  const siblings = UNI_LINKS.filter(l => l.path !== `/${slug}`).slice(0, 3);
  return [...siblings, ...subjectLinks.slice(0, 2), ...CORE_LINKS.slice(0, 1)];
}

interface UniInput {
  slug: string;
  name: string;         // full display name
  short: string;        // short/abbrev used in copy
  lms: string;          // primary LMS
  focus: string;        // program strengths phrase
  intro: string[];      // 2 unique intro paragraphs
  challenges: string;   // common student challenge sentence
  subjectLinks: RelatedLink[]; // 2 most-relevant subject pages
  faqs: { q: string; a: string }[];
}

function makeUni(u: UniInput): ServicePageData {
  return {
    slug: u.slug,
    title: `${u.name} Online Class Help | ${u.short} Assignment & Exam Help`,
    metaDescription: `Online class help for ${u.name} (${u.short}) students. Verified experts handle ${u.lms} coursework — assignments, quizzes, discussions & exams. Confidential, on time, pay weekly.`,
    keywords: `${u.short.toLowerCase()} online class help, ${u.name.toLowerCase()} help, take my ${u.short.toLowerCase()} class, ${u.short.toLowerCase()} assignment help, ${u.short.toLowerCase()} ${u.lms.toLowerCase()} help`,
    badge: `${u.short} Help`,
    h1: `${u.name} Online Class Help`,
    heroLead: `Enrolled at ${u.name}? Our verified experts help ${u.short} students stay on top of ${u.lms} coursework — assignments, quizzes, discussions, and exams — accurately, confidentially, and on time.`,
    introH2: `Trusted Online Class Help for ${u.name} Students`,
    introParas: [
      ...u.intro,
      `${u.short} is known for ${u.focus}. ${u.challenges} EduPilotHelp matches you with an expert who understands how ${u.short} structures its courses and keeps your grades on track from the first week to the final submission.`,
    ],
    featuresH2: `Why ${u.short} Students Choose EduPilotHelp`,
    features: UNI_FEATURES,
    processH2: `How We Help ${u.short} Students`,
    steps: [
      { num: '01', title: 'Share Your Course Details', desc: `Send your ${u.lms} login or syllabus so we can scope the workload — free, with zero commitment.` },
      { num: '02', title: 'Get a Custom Plan', desc: 'We send a transparent weekly plan matched to your term calendar for approval.' },
      { num: '03', title: 'Expert Takes Over', desc: `A subject-matched expert completes each task in ${u.lms}, admin-reviewed before every deadline.` },
      { num: '04', title: 'Track & Approve', desc: 'Follow progress and grades in real time, releasing each installment only as work is delivered.' },
    ],
    faqs: u.faqs,
    related: uniRelated(u.slug, u.subjectLinks),
    ctaH2: `Get ${u.short} Online Class Help Today`,
    ctaText: `Get a free, confidential quote in 60 seconds and see how affordable stress-free help with your ${u.short} courses can be.`,
  };
}

const nursing = { label: 'Nursing Help', path: '/nursing-help' };
const business = { label: 'Business Management Help', path: '/business-management-help' };
const psychology = { label: 'Psychology Help', path: '/psychology-help' };
const accounting = { label: 'Accounting Help', path: '/accounting-help' };
const cs = { label: 'Computer Science Help', path: '/computer-science-help' };
const stats = { label: 'Statistics Help', path: '/statistics-help' };

export const UNIVERSITY_PAGES: Record<string, ServicePageData> = {
  'arizona-state-university-help': makeUni({
    slug: 'arizona-state-university-help', name: 'Arizona State University', short: 'ASU', lms: 'Canvas',
    focus: 'one of the largest online program offerings in the country through ASU Online',
    challenges: 'With fast-moving 7.5-week sessions and heavy discussion participation, it is easy to fall behind.',
    intro: [
      'ASU Online serves tens of thousands of students across business, engineering, nursing, and liberal arts, almost entirely through Canvas. The compressed session format rewards consistency and punishes even a single missed week.',
      'Whether you are balancing a full course load with work or juggling several accelerated sessions at once, our experts help ASU students keep every Canvas quiz, assignment, and discussion on schedule.',
    ],
    subjectLinks: [business, nursing],
    faqs: [
      { q: 'Do you work inside ASU Canvas?', a: 'Yes. Our experts log into ASU\'s Canvas environment and complete quizzes, assignments, and discussions directly, submitting each before its deadline.' },
      { q: 'Can you keep up with 7.5-week sessions?', a: 'Absolutely. We plan around ASU\'s accelerated session calendar so nothing slips during the compressed term.' },
      { q: 'Is my ASU login kept confidential?', a: 'Yes. Your credentials are encrypted, used only for your work, and deleted within 48 hours of completion.' },
      { q: 'Which ASU programs do you support?', a: 'Business, nursing, engineering, psychology, and liberal arts courses offered through ASU Online.' },
    ],
  }),
  'snhu-help': makeUni({
    slug: 'snhu-help', name: 'Southern New Hampshire University', short: 'SNHU', lms: 'Brightspace',
    focus: 'flexible 8-week online terms across business, IT, and psychology programs',
    challenges: 'SNHU\'s weekly milestone assignments and discussion posts add up quickly across an 8-week term.',
    intro: [
      'SNHU is one of the largest online universities in the US, delivering most coursework through Brightspace with a consistent weekly rhythm of discussions, assignments, and milestone submissions.',
      'Our experts help SNHU students stay on top of every weekly deliverable, from discussion responses to the final project, so your grade stays strong across the full 8-week term.',
    ],
    subjectLinks: [business, psychology],
    faqs: [
      { q: 'Do you support SNHU Brightspace?', a: 'Yes. Our experts complete SNHU coursework directly in Brightspace, including discussions, assignments, and milestone submissions.' },
      { q: 'Can you handle weekly milestone assignments?', a: 'Yes. We plan around SNHU\'s weekly milestone structure so each deliverable is completed and submitted on time.' },
      { q: 'Is it confidential?', a: 'Completely. Your identity and login are encrypted, never shared, and deleted within 48 hours.' },
      { q: 'Which SNHU programs do you cover?', a: 'Business, IT, psychology, healthcare administration, and liberal arts programs.' },
    ],
  }),
  'wgu-help': makeUni({
    slug: 'wgu-help', name: 'Western Governors University', short: 'WGU', lms: 'competency-based platform',
    focus: 'a competency-based model where you progress by passing objective assessments and performance tasks',
    challenges: 'WGU\'s pass/no-pass assessments and written performance tasks require a different strategy than traditional courses.',
    intro: [
      'WGU\'s competency-based education model is unique: instead of weekly grades, you advance by completing objective assessments and performance tasks. This flexibility is powerful but can stall when a tough assessment blocks your progress.',
      'Our experts understand WGU\'s performance-task rubrics and objective assessments, helping you move through courses efficiently while meeting the university\'s competency standards.',
    ],
    subjectLinks: [cs, business],
    faqs: [
      { q: 'Can you help with WGU performance tasks?', a: 'Yes. Our experts complete WGU written performance tasks to the competency rubric, so they meet evaluator standards.' },
      { q: 'How does help work with WGU\'s model?', a: 'Because WGU is competency-based, we focus on helping you pass objective assessments and performance tasks rather than weekly graded work.' },
      { q: 'Is my WGU account secure?', a: 'Yes. Credentials are encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which WGU programs do you cover?', a: 'IT and computer science, business, and healthcare programs.' },
    ],
  }),
  'purdue-global-help': makeUni({
    slug: 'purdue-global-help', name: 'Purdue University Global', short: 'Purdue Global', lms: 'Brightspace',
    focus: 'career-focused online degrees in business, IT, criminal justice, and healthcare',
    challenges: 'Purdue Global\'s seminars, discussion boards, and unit assignments run on a strict weekly cadence.',
    intro: [
      'Purdue Global delivers career-oriented online degrees through Brightspace, with weekly units that combine readings, discussions, seminars, and assignments on a firm schedule.',
      'Our experts help Purdue Global students complete each weekly unit accurately and on time, keeping pace with the university\'s structured term format.',
    ],
    subjectLinks: [business, accounting],
    faqs: [
      { q: 'Do you support Purdue Global Brightspace?', a: 'Yes. Our experts complete Purdue Global coursework in Brightspace, including unit assignments, discussions, and seminar work.' },
      { q: 'Can you handle weekly unit assignments?', a: 'Yes. We plan around Purdue Global\'s weekly unit structure so each deliverable is submitted on time.' },
      { q: 'Is it confidential?', a: 'Yes. Your login is encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which Purdue Global programs do you cover?', a: 'Business, IT, criminal justice, and healthcare programs.' },
    ],
  }),
  'liberty-university-help': makeUni({
    slug: 'liberty-university-help', name: 'Liberty University', short: 'Liberty', lms: 'Canvas',
    focus: 'a large online program with 8-week courses across business, education, and divinity',
    challenges: 'Liberty\'s discussion-board threads and weekly assignments require steady participation throughout each 8-week course.',
    intro: [
      'Liberty University Online offers hundreds of programs through Canvas, structured around 8-week courses with regular discussion boards, quizzes, and assignments.',
      'Our experts help Liberty students keep up with every Canvas deadline, from discussion responses to major papers, across the full term.',
    ],
    subjectLinks: [business, psychology],
    faqs: [
      { q: 'Do you work inside Liberty Canvas?', a: 'Yes. Our experts complete Liberty coursework in Canvas, including discussions, quizzes, and assignments.' },
      { q: 'Can you keep up with 8-week courses?', a: 'Yes. We plan around Liberty\'s 8-week format so nothing slips during the term.' },
      { q: 'Is my information confidential?', a: 'Completely. Your login is encrypted, never shared, and deleted within 48 hours.' },
      { q: 'Which Liberty programs do you cover?', a: 'Business, education, psychology, and general studies programs.' },
    ],
  }),
  'university-of-phoenix-help': makeUni({
    slug: 'university-of-phoenix-help', name: 'University of Phoenix', short: 'UOPX', lms: 'its online classroom',
    focus: 'flexible online degrees with a focus on working adults in business, healthcare, and technology',
    challenges: 'UOPX\'s participation requirements and weekly learning-team activities demand consistent engagement.',
    intro: [
      'University of Phoenix serves working adults through its online classroom, with courses built around weekly participation, individual assignments, and learning-team activities.',
      'Our experts help UOPX students meet participation requirements and complete assignments on time, keeping your grades steady while you balance work and study.',
    ],
    subjectLinks: [business, accounting],
    faqs: [
      { q: 'Do you support the UOPX online classroom?', a: 'Yes. Our experts complete UOPX coursework including participation posts, individual assignments, and learning-team contributions.' },
      { q: 'Can you meet participation requirements?', a: 'Yes. We handle the weekly participation and discussion requirements that UOPX courses require.' },
      { q: 'Is it confidential?', a: 'Yes. Your login is encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which UOPX programs do you cover?', a: 'Business, healthcare administration, IT, and criminal justice programs.' },
    ],
  }),
  'grand-canyon-university-help': makeUni({
    slug: 'grand-canyon-university-help', name: 'Grand Canyon University', short: 'GCU', lms: 'its LoudCloud / Halo platform',
    focus: 'online and hybrid programs in nursing, business, and education',
    challenges: 'GCU\'s discussion questions, weekly assignments, and clinical or practicum documentation keep the workload high.',
    intro: [
      'Grand Canyon University delivers online coursework through its Halo (formerly LoudCloud) platform, with weekly discussion questions, assignments, and program-specific requirements — especially heavy in nursing.',
      'Our experts help GCU students stay on top of every weekly deliverable, from discussion questions to major assignments, across nursing, business, and education programs.',
    ],
    subjectLinks: [nursing, business],
    faqs: [
      { q: 'Do you support the GCU Halo platform?', a: 'Yes. Our experts complete GCU coursework in Halo, including discussion questions and weekly assignments.' },
      { q: 'Can you help GCU nursing students?', a: 'Yes. We support GCU nursing coursework including papers, care plans, and discussion questions to the program rubric.' },
      { q: 'Is my GCU login secure?', a: 'Yes. Credentials are encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which GCU programs do you cover?', a: 'Nursing, business, education, and psychology programs.' },
    ],
  }),
  'capella-university-help': makeUni({
    slug: 'capella-university-help', name: 'Capella University', short: 'Capella', lms: 'its courseroom',
    focus: 'competency-based and FlexPath self-paced options in psychology, business, and nursing',
    challenges: 'Capella\'s FlexPath model and detailed scoring-guide rubrics require work that maps precisely to each criterion.',
    intro: [
      'Capella University offers both GuidedPath and self-paced FlexPath formats through its online courseroom, with assignments graded against detailed scoring guides.',
      'Our experts understand Capella\'s scoring-guide rubrics and help students complete assignments that map precisely to each criterion, whether in FlexPath or GuidedPath.',
    ],
    subjectLinks: [psychology, nursing],
    faqs: [
      { q: 'Can you help with Capella FlexPath?', a: 'Yes. Our experts complete FlexPath assignments mapped precisely to Capella\'s scoring-guide criteria.' },
      { q: 'Do you follow Capella scoring guides?', a: 'Yes. Every assignment is written to meet the specific scoring-guide rubric for that course.' },
      { q: 'Is it confidential?', a: 'Yes. Your login is encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which Capella programs do you cover?', a: 'Psychology, nursing, business, and counseling programs.' },
    ],
  }),
  'walden-university-help': makeUni({
    slug: 'walden-university-help', name: 'Walden University', short: 'Walden', lms: 'Blackboard',
    focus: 'graduate-heavy online programs in nursing, psychology, social work, and education',
    challenges: 'Walden\'s discussion posts, application assignments, and APA-heavy writing set a demanding graduate pace.',
    intro: [
      'Walden University delivers graduate-focused online programs through Blackboard, with weekly discussion posts, application assignments, and rigorous APA writing standards.',
      'Our experts help Walden students meet graduate-level expectations, completing discussions and application papers in correct APA format and on schedule.',
    ],
    subjectLinks: [nursing, psychology],
    faqs: [
      { q: 'Do you support Walden Blackboard?', a: 'Yes. Our experts complete Walden coursework in Blackboard, including discussions and application assignments.' },
      { q: 'Do you follow Walden\'s APA standards?', a: 'Yes. All Walden papers are written in correct APA 7th edition, which the university requires.' },
      { q: 'Is my Walden login confidential?', a: 'Yes. Credentials are encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which Walden programs do you cover?', a: 'Nursing, psychology, social work, education, and public health programs.' },
    ],
  }),
};

export const UNIVERSITY_SLUGS = Object.keys(UNIVERSITY_PAGES);

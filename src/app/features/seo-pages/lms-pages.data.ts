import { ServicePageData, ServiceFeature, RelatedLink } from './service-pages.data';

const LMS_FEATURES: ServiceFeature[] = [
  { icon: '✅', title: 'Platform Specialists', desc: 'Experts who work in this exact LMS every day — they know its quirks, timers, and submission rules cold.' },
  { icon: '🔒', title: '100% Confidential', desc: 'Your login is encrypted, used only for your work, and deleted within 48 hours. Your identity is never shared.' },
  { icon: '⏱️', title: 'Never Miss a Deadline', desc: 'Every quiz, assignment, and discussion is completed and submitted before the platform closes it.' },
  { icon: '💳', title: 'Pay As You Go', desc: 'Flexible weekly installments through Stripe — you only pay as work is delivered and admin-reviewed.' },
  { icon: '📋', title: 'Admin Quality Review', desc: 'Every submission passes an internal quality check before it goes live in your course.' },
  { icon: '📞', title: '24/7 Live Support', desc: 'Real humans reply in under 5 minutes on WhatsApp, any timezone, every day of the week.' },
];

const LMS_LINKS: RelatedLink[] = [
  { label: 'Canvas Class Help', path: '/canvas-class-help' },
  { label: 'Blackboard Help', path: '/blackboard-help' },
  { label: 'Moodle Help', path: '/moodle-help' },
  { label: 'Brightspace Help', path: '/brightspace-help' },
  { label: 'Pearson MyLab Help', path: '/pearson-mylab-help' },
  { label: 'ALEKS Help', path: '/aleks-help' },
  { label: 'Cengage MindTap Help', path: '/cengage-mindtap-help' },
  { label: 'McGraw Hill Connect Help', path: '/mcgraw-hill-connect-help' },
  { label: 'WebAssign Help', path: '/webassign-help' },
  { label: 'WileyPLUS Help', path: '/wileyplus-help' },
];

const CORE_LINKS: RelatedLink[] = [
  { label: 'Online Class Help', path: '/online-class-help' },
  { label: 'Take My Online Class', path: '/take-my-online-class' },
  { label: 'Assignment Help', path: '/assignment-help' },
  { label: 'Online Exam Help', path: '/exam-help' },
];

function lmsRelated(slug: string): RelatedLink[] {
  const siblings = LMS_LINKS.filter(l => l.path !== `/${slug}`).slice(0, 4);
  return [...siblings, ...CORE_LINKS.slice(0, 2)];
}

function makeLms(
  slug: string, platform: string, keywordsExtra: string,
  heroLead: string, introParas: string[], faqs: { q: string; a: string }[]
): ServicePageData {
  return {
    slug,
    title: `${platform} Help | Expert Help With ${platform} Classes & Coursework`,
    metaDescription: `Professional ${platform} help from verified experts. We handle ${platform} quizzes, assignments, discussions & exams — securely and on time. 99.1% success rate, pay weekly.`,
    keywords: `${platform.toLowerCase()} help, ${platform.toLowerCase()} class help, ${keywordsExtra}, do my ${platform.toLowerCase()} class, ${platform.toLowerCase()} assignment help`,
    badge: `${platform} Help`,
    h1: `${platform} Help From Verified Experts`,
    heroLead,
    introH2: `Reliable Help With Your ${platform} Coursework`,
    introParas,
    featuresH2: `Why Students Choose Our ${platform} Help`,
    features: LMS_FEATURES,
    processH2: `How Our ${platform} Help Works`,
    steps: [
      { num: '01', title: 'Share Your Course Access', desc: `Send your ${platform} login or course details so we can scope the workload — free, with zero commitment.` },
      { num: '02', title: 'Get a Custom Plan', desc: 'We send a transparent weekly plan matched to your course calendar for your approval.' },
      { num: '03', title: 'Expert Takes Over', desc: `A ${platform} specialist completes each task inside your portal, admin-reviewed before every deadline.` },
      { num: '04', title: 'Track & Approve', desc: 'Follow progress and grades in real time, releasing each installment only as work is delivered.' },
    ],
    faqs,
    related: lmsRelated(slug),
    ctaH2: `Get Expert ${platform} Help Today`,
    ctaText: `Get a free, no-obligation quote in 60 seconds and see how affordable stress-free ${platform} help can be.`,
  };
}

export const LMS_PAGES: Record<string, ServicePageData> = {
  'canvas-class-help': makeLms(
    'canvas-class-help', 'Canvas', 'take my canvas class, canvas quiz help, pay someone to do my canvas class',
    'Struggling to keep up with a Canvas course? Our verified experts log into your Canvas portal and handle quizzes, assignments, discussions, and exams — accurately and always before the deadline.',
    [
      'Canvas is one of the most widely used learning platforms in US higher education, and its rolling weekly deadlines, timed quizzes, and discussion requirements can pile up fast. EduPilotHelp gives you dependable Canvas help from experts who work in the platform every single day.',
      'When you request Canvas help, we match you with a specialist who navigates SpeedGrader submissions, module locks, timed assessments, and Turnitin checks with confidence. They follow your syllabus precisely and complete each task to your target standard.',
      'From a single overwhelming module to an entire Canvas course, our team has completed thousands of Canvas classes with a 99.1% success rate — securely, confidentially, and on time.',
    ],
    [
      { q: 'Can you complete tasks directly inside Canvas?', a: 'Yes. Our experts log into your Canvas account and complete quizzes, assignments, discussions, and exams directly in the platform, submitting each item before its deadline.' },
      { q: 'Do you handle timed Canvas quizzes?', a: 'Absolutely. Timed and locked Canvas quizzes are completed in real time by an expert ready during your quiz window, so nothing is missed.' },
      { q: 'Is my Canvas login kept secure?', a: 'Yes. Your credentials are encrypted, used only for your work, and permanently deleted within 48 hours of completion.' },
      { q: 'How much does Canvas help cost?', a: 'Canvas class help starts from $42 per week for standard courses, with flexible Stripe installments. You get a free custom quote within 24 hours.' },
    ],
  ),
  'blackboard-help': makeLms(
    'blackboard-help', 'Blackboard', 'take my blackboard class, blackboard exam help, blackboard learn help',
    'Falling behind in Blackboard Learn? Our experts handle your entire Blackboard course — assessments, assignments, discussion boards, and proctored tests — securely and on schedule.',
    [
      'Blackboard Learn powers courses at hundreds of US colleges, and its assessment tools, adaptive release rules, and SafeAssign checks can make coursework stressful. EduPilotHelp provides Blackboard help from specialists who know the platform inside out.',
      'Your matched expert works within Blackboard to complete tests, assignments, and discussion posts, respecting availability windows, attempt limits, and originality requirements. Everything is admin-reviewed before it reaches your instructor.',
      'Whether you need help with one tough assessment or a full Blackboard course, we deliver accurate work before every deadline with total confidentiality.',
    ],
    [
      { q: 'Can you take my Blackboard test?', a: 'Yes. Our experts complete Blackboard tests and assessments within their availability windows, following attempt limits and timing rules for a strong, secure result.' },
      { q: 'Do you handle SafeAssign submissions?', a: 'We produce original work checked for integrity before submission, so it holds up to SafeAssign and instructor review.' },
      { q: 'Will my instructor know?', a: 'No. Your identity is encrypted, experts use secure region-matched connections, and no third party can detect our involvement.' },
      { q: 'Can you cover a whole Blackboard course?', a: 'Yes — from a single assessment to an entire term, we manage your full Blackboard course to your target grade.' },
    ],
  ),
  'moodle-help': makeLms(
    'moodle-help', 'Moodle', 'take my moodle class, moodle quiz help, do my moodle assignment',
    'Need help with a Moodle course? Our verified experts handle Moodle quizzes, assignments, forums, and exams directly in your portal — accurate work, delivered on time.',
    [
      'Moodle is used by universities worldwide, and its quiz timers, forum participation rules, and assignment submission types can be demanding across a busy semester. EduPilotHelp gives you reliable Moodle help from experienced specialists.',
      'Your expert works inside Moodle to complete graded quizzes, upload assignments, and post to discussion forums, following your course settings and deadlines precisely. Each task is quality-reviewed before submission.',
      'From a single Moodle quiz to a complete course, we keep your grades protected with dependable, confidential support.',
    ],
    [
      { q: 'Can you complete Moodle quizzes and assignments?', a: 'Yes. Our experts log into Moodle and complete quizzes, file-upload assignments, and forum posts directly, submitting each before its deadline.' },
      { q: 'Do you handle timed Moodle quizzes?', a: 'Yes, timed Moodle quizzes are completed in real time by an expert ready during your quiz window.' },
      { q: 'Is my Moodle account safe?', a: 'Completely. Credentials are encrypted, used only for your work, and deleted within 48 hours of completion.' },
      { q: 'What does Moodle help cost?', a: 'Standard Moodle courses start from $42 per week with flexible installments. Request a free quote for an exact price.' },
    ],
  ),
  'brightspace-help': makeLms(
    'brightspace-help', 'Brightspace', 'take my brightspace class, d2l help, brightspace quiz help',
    'Managing a D2L Brightspace course is easier with expert help. We handle your Brightspace quizzes, assignments, discussions, and exams securely and on time.',
    [
      'D2L Brightspace is used across many US colleges, with quiz timers, release conditions, and rubric-graded assignments that demand steady weekly effort. EduPilotHelp provides Brightspace help from specialists fluent in the platform.',
      'Your expert completes Brightspace quizzes, dropbox assignments, and discussion posts inside your course, respecting availability dates and rubric requirements. Everything is admin-reviewed before submission.',
      'From one module to a full Brightspace course, we deliver accurate, on-time work with complete confidentiality.',
    ],
    [
      { q: 'Can you work inside Brightspace / D2L?', a: 'Yes. Our experts complete quizzes, dropbox assignments, and discussions directly inside D2L Brightspace, submitting each before its deadline.' },
      { q: 'Do you handle timed Brightspace quizzes?', a: 'Yes, timed quizzes are completed in real time within your availability window.' },
      { q: 'Is it confidential?', a: 'Fully. Your login is encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Can you handle a full Brightspace course?', a: 'Yes, from a single quiz to an entire term to your target grade.' },
    ],
  ),
  'pearson-mylab-help': makeLms(
    'pearson-mylab-help', 'Pearson MyLab', 'mylab help, pearson mylab math help, mymathlab help, mylab statistics help',
    'Stuck in Pearson MyLab or Mastering? Our experts complete your MyLab homework, quizzes, and tests directly in the platform — accurate, step-by-step, and on time.',
    [
      'Pearson MyLab and Mastering power math, statistics, accounting, and science courses at thousands of schools, with algorithmic homework and strict deadlines. EduPilotHelp provides MyLab help from subject experts who work in the platform daily.',
      'Your expert completes MyLab homework, quizzes, and proctored tests directly in the system, showing correct methods and hitting mastery thresholds. Everything is reviewed for accuracy before submission.',
      'Whether it is MyMathLab, MyStatLab, MyAccountingLab, or Mastering, we keep your grades strong with reliable, confidential help.',
    ],
    [
      { q: 'Can you do my MyMathLab / MyStatLab homework?', a: 'Yes. Our experts complete MyLab and Mastering homework, quizzes, and tests directly in the platform with correct, verified answers.' },
      { q: 'Do you handle timed MyLab tests?', a: 'Yes, timed and proctored MyLab tests are handled in real time by an expert ready during your test window.' },
      { q: 'Is my Pearson account secure?', a: 'Yes. Credentials are encrypted, used only for your work, and deleted within 48 hours of completion.' },
      { q: 'Which MyLab courses do you cover?', a: 'MyMathLab, MyStatLab, MyAccountingLab, MyEconLab, and Mastering Biology, Chemistry, and Physics.' },
    ],
  ),
  'aleks-help': makeLms(
    'aleks-help', 'ALEKS', 'aleks math help, do my aleks, aleks chemistry help, take my aleks class',
    'ALEKS topics and assessments taking over your week? Our math and chemistry experts complete your ALEKS pie, objectives, and assessments accurately and on schedule.',
    [
      'ALEKS uses adaptive assessments and topic mastery to drive math, chemistry, and accounting courses, which can be relentless when objectives stack up. EduPilotHelp provides ALEKS help from experts who understand its adaptive system.',
      'Your expert completes ALEKS topics, meets objective deadlines, and handles initial and progress assessments accurately, keeping your pie moving toward completion. Work is verified before submission.',
      'From weekly objectives to full course completion, we help you stay on top of ALEKS with dependable, confidential support.',
    ],
    [
      { q: 'Can you complete my ALEKS objectives and assessments?', a: 'Yes. Our experts complete ALEKS topics, objectives, and assessments accurately, keeping your progress on track toward mastery.' },
      { q: 'Do you handle ALEKS assessments in real time?', a: 'Yes, timed ALEKS assessments are completed by an expert ready during your assessment window.' },
      { q: 'Is my ALEKS login safe?', a: 'Yes. Your credentials are encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which ALEKS subjects do you cover?', a: 'Mathematics (all levels), chemistry, and accounting ALEKS courses.' },
    ],
  ),
  'cengage-mindtap-help': makeLms(
    'cengage-mindtap-help', 'Cengage MindTap', 'mindtap help, cengage help, do my mindtap, take my mindtap class',
    'MindTap activities and quizzes piling up? Our experts complete your Cengage MindTap readings, assignments, and quizzes directly in the platform, on time.',
    [
      'Cengage MindTap delivers interactive readings, activities, and quizzes across business, science, and humanities courses, with steady weekly deadlines. EduPilotHelp provides MindTap help from experts fluent in the platform.',
      'Your expert completes MindTap activities, assignments, and quizzes inside your course, following your progress path and deadlines. Everything is quality-reviewed before submission.',
      'From a single MindTap module to a full course, we keep your grades on track with reliable, confidential help.',
    ],
    [
      { q: 'Can you complete MindTap activities and quizzes?', a: 'Yes. Our experts complete MindTap readings, activities, assignments, and quizzes directly in the platform before each deadline.' },
      { q: 'Do you handle timed MindTap quizzes?', a: 'Yes, timed quizzes are completed in real time within your availability window.' },
      { q: 'Is my Cengage account secure?', a: 'Yes. Credentials are encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Can you handle a whole MindTap course?', a: 'Yes, from a single module to an entire term to your target grade.' },
    ],
  ),
  'mcgraw-hill-connect-help': makeLms(
    'mcgraw-hill-connect-help', 'McGraw Hill Connect', 'connect help, mcgraw hill connect answers, do my connect homework, take my connect class',
    'McGraw Hill Connect homework and exams under control — our experts complete your Connect assignments, LearnSmart, and proctored tests accurately and on time.',
    [
      'McGraw Hill Connect powers accounting, business, economics, and science courses with algorithmic homework, SmartBook readings, and timed exams. EduPilotHelp provides Connect help from subject experts who work in the platform daily.',
      'Your expert completes Connect homework, SmartBook and LearnSmart assignments, and proctored exams directly in the system, with correct methods and on-time submission. Work is verified before delivery.',
      'From weekly Connect homework to full course completion, we keep your grades strong with dependable, confidential support.',
    ],
    [
      { q: 'Can you do my McGraw Hill Connect homework?', a: 'Yes. Our experts complete Connect homework, SmartBook, LearnSmart, and exams directly in the platform with accurate, verified answers.' },
      { q: 'Do you handle proctored Connect exams?', a: 'We assist with many Connect exam formats using secure methods — share your exam details and we will confirm what is possible.' },
      { q: 'Is my Connect login secure?', a: 'Yes. Credentials are encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which Connect subjects do you cover?', a: 'Accounting, economics, business, statistics, biology, chemistry, and more.' },
    ],
  ),
  'webassign-help': makeLms(
    'webassign-help', 'WebAssign', 'webassign answers, do my webassign, take my webassign class, webassign math help',
    'WebAssign math, physics, or chemistry problems piling up? Our STEM experts complete your WebAssign homework and tests accurately, with correct working, on time.',
    [
      'WebAssign is a leading platform for math, physics, chemistry, and statistics homework, with algorithmic problems and firm deadlines. EduPilotHelp provides WebAssign help from STEM specialists who work in the platform regularly.',
      'Your expert completes WebAssign homework and tests directly in the system, entering correct answers with proper methods and meeting every deadline. Work is checked for accuracy before submission.',
      'From weekly WebAssign sets to timed tests, we keep your STEM grades strong with reliable, confidential help.',
    ],
    [
      { q: 'Can you do my WebAssign homework?', a: 'Yes. Our STEM experts complete WebAssign homework and tests directly in the platform with correct, verified answers and proper working.' },
      { q: 'Do you handle timed WebAssign tests?', a: 'Yes, timed WebAssign tests are completed in real time by an expert ready during your test window.' },
      { q: 'Is my WebAssign account safe?', a: 'Yes. Credentials are encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which WebAssign subjects do you cover?', a: 'Mathematics (all levels), physics, chemistry, and statistics.' },
    ],
  ),
  'wileyplus-help': makeLms(
    'wileyplus-help', 'WileyPLUS', 'wileyplus answers, do my wileyplus, take my wileyplus class, wileyplus accounting help',
    'WileyPLUS assignments and exams handled by experts — we complete your WileyPLUS homework, quizzes, and tests accurately and before every deadline.',
    [
      'WileyPLUS supports accounting, finance, and science courses with online homework, reading assignments, and timed assessments. EduPilotHelp provides WileyPLUS help from subject experts fluent in the platform.',
      'Your expert completes WileyPLUS assignments, quizzes, and exams directly in the system, following your course structure and deadlines. Every submission is quality-reviewed for accuracy.',
      'From weekly WileyPLUS homework to full course support, we keep your grades on track with dependable, confidential help.',
    ],
    [
      { q: 'Can you do my WileyPLUS assignments?', a: 'Yes. Our experts complete WileyPLUS homework, quizzes, and exams directly in the platform with accurate, verified answers.' },
      { q: 'Do you handle timed WileyPLUS exams?', a: 'Yes, timed assessments are completed in real time by an expert ready during your exam window.' },
      { q: 'Is my WileyPLUS login secure?', a: 'Yes. Credentials are encrypted, used only for your work, and deleted within 48 hours.' },
      { q: 'Which WileyPLUS subjects do you cover?', a: 'Accounting, finance, economics, and science courses.' },
    ],
  ),
};

export const LMS_SLUGS = Object.keys(LMS_PAGES);

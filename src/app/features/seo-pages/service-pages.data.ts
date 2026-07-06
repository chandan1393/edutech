export interface ServiceFaq { q: string; a: string; }
export interface RelatedLink { label: string; path: string; }
export interface ServiceFeature { icon: string; title: string; desc: string; }
export interface ServicePageData {
  slug: string;
  // SEO
  title: string;            // browser/OG title
  metaDescription: string;
  keywords: string;
  // Hero
  badge: string;
  h1: string;
  heroLead: string;
  // Intro body (H2 + paragraphs)
  introH2: string;
  introParas: string[];
  // Benefits / features
  featuresH2: string;
  features: ServiceFeature[];
  // Process
  processH2: string;
  steps: { num: string; title: string; desc: string }[];
  // FAQ
  faqs: ServiceFaq[];
  // Internal links to sibling services
  related: RelatedLink[];
  // CTA
  ctaH2: string;
  ctaText: string;
}

const COMMON_FEATURES: ServiceFeature[] = [
  { icon: '✅', title: 'Verified Subject Experts', desc: 'Every task is matched to a vetted specialist in that exact discipline — never a random freelancer.' },
  { icon: '🔒', title: '100% Confidential', desc: 'Your identity stays encrypted. Credentials are deleted within 48 hours and never shared with anyone.' },
  { icon: '💳', title: 'Flexible Installments', desc: 'Stripe-secured pay-as-you-go. You only pay as work is delivered and admin-reviewed — never a lump sum.' },
  { icon: '📋', title: 'Admin Quality Review', desc: 'Every deliverable passes an internal quality check before it reaches you — an extra layer of assurance.' },
  { icon: '🔄', title: 'Unlimited Revisions', desc: 'Not satisfied? Unlimited revisions within 7 days until the work meets your standard — free of charge.' },
  { icon: '📞', title: '24/7 Live Support', desc: 'Real humans answer in under 5 minutes on WhatsApp and under 2 hours by email — any timezone, every day.' },
];

const ALL_LINKS: RelatedLink[] = [
  { label: 'Online Class Help', path: '/online-class-help' },
  { label: 'Assignment Help', path: '/assignment-help' },
  { label: 'Homework Help', path: '/homework-help' },
  { label: 'Online Exam Help', path: '/exam-help' },
  { label: 'Online Quiz Help', path: '/quiz-help' },
  { label: 'Discussion Post Help', path: '/discussion-post-help' },
  { label: 'Essay Writing Help', path: '/essay-writing-help' },
  { label: 'Take My Online Class', path: '/take-my-online-class' },
  { label: 'Online Course Help', path: '/online-course-help' },
];

/** Return related links excluding the current page. */
function relatedFor(slug: string, count = 5): RelatedLink[] {
  return ALL_LINKS.filter(l => l.path !== `/${slug}`).slice(0, count);
}

export const SERVICE_PAGES: Record<string, ServicePageData> = {
  'online-class-help': {
    slug: 'online-class-help',
    title: 'Online Class Help | Expert Help With Your Entire Online Class',
    metaDescription: 'Professional online class help from verified experts. We handle Canvas, Blackboard & Moodle classes — quizzes, assignments, discussions & exams. Pay weekly, 99.1% success rate.',
    keywords: 'online class help, take my online class, online class helper, pay someone to do my online class, online class assistance',
    badge: 'Online Class Help',
    h1: 'Online Class Help From Verified Academic Experts',
    heroLead: 'Juggling work, family, and a full course load? Let a subject-matched expert manage your entire online class — quizzes, assignments, discussions, and exams — while you stay in control every step of the way.',
    introH2: 'Reliable Help With Your Online Class, Start to Finish',
    introParas: [
      'Online classes promise flexibility but often deliver stress: rigid weekly deadlines, dense discussion boards, and proctored exams that pile up fast. EduPilotHelp gives busy US college students dependable online class help so no deadline slips and your GPA stays protected.',
      'When you request online class help, we match you with a verified expert in your subject who logs into your portal, follows your syllabus, and completes each task to your target standard. You approve every payment as work is delivered — no lump sums, no surprises.',
      'From a single tough module to an entire semester, our team has handled 5,000+ online classes with a 99.1% success rate across Canvas, Blackboard, Moodle, and every major LMS.',
    ],
    featuresH2: 'Why Students Choose Our Online Class Help',
    features: COMMON_FEATURES,
    processH2: 'How Our Online Class Help Works',
    steps: [
      { num: '01', title: 'Share Your Class Details', desc: 'Send your portal login or syllabus so we can gauge the workload — free, with zero commitment.' },
      { num: '02', title: 'Get a Custom Plan', desc: 'We send a transparent, itemized weekly plan matched to your class calendar for your approval.' },
      { num: '03', title: 'Expert Takes Over', desc: 'Your subject-matched expert handles every task in your portal, admin-reviewed before each deadline.' },
      { num: '04', title: 'Track & Approve', desc: 'Follow progress and grades in real time, and release each installment only as work is delivered.' },
    ],
    faqs: [
      { q: 'Can someone really take my whole online class?', a: 'Yes. A verified expert logs into your LMS and completes quizzes, assignments, discussions, and exams throughout the term. You keep full visibility and approve each payment as work is delivered.' },
      { q: 'How much does online class help cost?', a: 'Standard undergraduate classes start from $42 per week. Advanced subjects range higher. Everything runs on flexible Stripe installments — you never pay a lump sum up front.' },
      { q: 'Which platforms do you support?', a: 'Canvas, Blackboard, Moodle, D2L Brightspace, Pearson MyLab, McGraw-Hill Connect, ALEKS, WebAssign and more. Whatever portal your school uses, our experts navigate it from day one.' },
      { q: 'Is my information kept private?', a: 'Absolutely. Your identity is encrypted, experts never learn who you are, and all portal credentials are deleted within 48 hours of completion.' },
    ],
    related: relatedFor('online-class-help'),
    ctaH2: 'Ready to Take the Pressure Off Your Online Class?',
    ctaText: 'Get a free, no-obligation quote in 60 seconds and see exactly how affordable stress-free online class help can be.',
  },

  'assignment-help': {
    slug: 'assignment-help',
    title: 'Assignment Help | Custom Assignment Writing & Solutions',
    metaDescription: 'Expert assignment help for any subject. Original, well-researched assignments delivered before your deadline. Nursing, business, CS, math & more. Unlimited revisions, pay weekly.',
    keywords: 'assignment help, assignment writing help, do my assignment, online assignment help, nursing assignment help, programming assignment help',
    badge: 'Assignment Help',
    h1: 'Assignment Help That Meets Every Deadline',
    heroLead: 'From a single overdue paper to a semester of coursework, our verified experts deliver original, well-researched assignments matched to your rubric — always before the deadline.',
    introH2: 'Custom Assignment Help for Every Subject',
    introParas: [
      'A stack of assignments across different courses is one of the fastest ways to fall behind. EduPilotHelp gives you assignment help from specialists who understand your subject, your rubric, and your deadlines — so nothing slips through the cracks.',
      'Every assignment is written from scratch, checked for originality, and reviewed by our admin quality team before it reaches you. You get work that reads like yours and holds up to scrutiny.',
      'Whether it is a nursing care plan, a programming project, a statistics report, or a business case study, we match you with the right expert and deliver on time, every time.',
    ],
    featuresH2: 'What Makes Our Assignment Help Different',
    features: COMMON_FEATURES,
    processH2: 'How to Get Assignment Help',
    steps: [
      { num: '01', title: 'Send the Brief', desc: 'Upload the assignment prompt, rubric, and deadline — we review it and confirm scope for free.' },
      { num: '02', title: 'Approve the Quote', desc: 'Get a clear, per-assignment price with a flexible payment plan before any work starts.' },
      { num: '03', title: 'Expert Writes It', desc: 'A subject specialist completes the assignment, then our quality team reviews it end to end.' },
      { num: '04', title: 'Review & Revise', desc: 'Download your work ahead of the deadline and request unlimited revisions within 7 days.' },
    ],
    faqs: [
      { q: 'Is the assignment written from scratch?', a: 'Yes. Every assignment is original, researched, and written specifically for you, then checked for originality before delivery.' },
      { q: 'Can you match my rubric and style?', a: 'We follow your rubric, citation style, and any instructor notes exactly. Share a past submission and we can mirror your writing voice too.' },
      { q: 'What subjects do you cover?', a: 'Over 200 subjects including nursing, business, computer science, mathematics, statistics, psychology, law, and engineering.' },
      { q: 'What if I need changes?', a: 'Unlimited revisions within 7 days of delivery, at no extra cost, until the assignment meets your standard.' },
    ],
    related: relatedFor('assignment-help'),
    ctaH2: 'Have an Assignment Due Soon?',
    ctaText: 'Send us the brief now and get a free quote in minutes — original, on-time assignment help is one click away.',
  },

  'homework-help': {
    slug: 'homework-help',
    title: 'Homework Help | Fast, Reliable Help With Any Homework',
    metaDescription: 'Get homework help from verified experts across every subject. Step-by-step solutions, on-time delivery, MyMathLab, Pearson & Canvas supported. Pay as you go, unlimited revisions.',
    keywords: 'homework help, do my homework, online homework help, mymathlab help, pearson homework help, math homework help',
    badge: 'Homework Help',
    h1: 'Homework Help You Can Count On',
    heroLead: 'Stuck on homework or short on time? Our experts deliver accurate, step-by-step homework solutions across every subject and platform — clear, correct, and on time.',
    introH2: 'Homework Help Across Every Subject and Platform',
    introParas: [
      'Homework adds up fast when you are managing several courses at once. EduPilotHelp gives you reliable homework help from specialists who deliver correct, clearly worked solutions — not just answers.',
      'We support the platforms your courses actually use — MyMathLab, Pearson, ALEKS, WebAssign, Canvas, and more — so your homework is completed directly where it needs to be submitted.',
      'From weekly problem sets to end-of-term catch-ups, we keep you on track with accurate work delivered before every deadline.',
    ],
    featuresH2: 'Why Our Homework Help Works',
    features: COMMON_FEATURES,
    processH2: 'How Homework Help Works',
    steps: [
      { num: '01', title: 'Share the Homework', desc: 'Send the problem set, portal access, or screenshots plus the due date — reviewed free of charge.' },
      { num: '02', title: 'Get Your Price', desc: 'Receive a transparent quote with flexible payment before we begin any work.' },
      { num: '03', title: 'Expert Solves It', desc: 'A subject expert completes the homework with clear working, quality-checked for accuracy.' },
      { num: '04', title: 'Delivered On Time', desc: 'Get your solutions before the deadline, with revisions available if anything needs adjusting.' },
    ],
    faqs: [
      { q: 'Can you complete homework inside MyMathLab or Pearson?', a: 'Yes. Our experts work directly inside MyMathLab, Pearson, ALEKS, WebAssign, and other platforms to complete and submit your homework where required.' },
      { q: 'Do I get step-by-step working?', a: 'When you need it, yes. We can provide fully worked solutions so you can learn the method, not just the final answer.' },
      { q: 'How fast can you turn homework around?', a: 'Turnaround depends on length and complexity, but urgent same-day homework is often possible. Share the deadline and we will confirm.' },
      { q: 'Is my account safe?', a: 'Yes. Credentials are encrypted, used only for your work, and deleted within 48 hours of completion.' },
    ],
    related: relatedFor('homework-help'),
    ctaH2: 'Homework Piling Up?',
    ctaText: 'Send it over and get a free quote fast — accurate, on-time homework help is ready when you are.',
  },

  'exam-help': {
    slug: 'exam-help',
    title: 'Online Exam Help | Expert Help With Proctored & Timed Exams',
    metaDescription: 'Discreet online exam help from verified experts. Proctored, timed, and open-book exams handled securely across Canvas, Blackboard & more. High scores, full confidentiality.',
    keywords: 'online exam help, take my online exam, exam help, proctored exam help, do my online exam, online test help',
    badge: 'Online Exam Help',
    h1: 'Online Exam Help From Trusted Experts',
    heroLead: 'From timed quizzes to proctored finals, our subject experts help you achieve strong exam results discreetly and securely — with total confidentiality at every step.',
    introH2: 'Secure, Discreet Help With Your Online Exams',
    introParas: [
      'Online exams carry high stakes and tight time limits. EduPilotHelp connects you with a verified expert in your subject who is ready to help you perform when it counts most.',
      'We handle timed, open-book, and many proctored exam formats across Canvas, Blackboard, Moodle, and other platforms, following strict security practices to protect your privacy.',
      'With a 99.1% success rate across thousands of exams, we help you walk into every test with confidence and walk out with the score you need.',
    ],
    featuresH2: 'Why Students Trust Our Exam Help',
    features: COMMON_FEATURES,
    processH2: 'How Online Exam Help Works',
    steps: [
      { num: '01', title: 'Share Exam Details', desc: 'Tell us the subject, date, format, and platform — we confirm what we can help with, free.' },
      { num: '02', title: 'Confirm Your Plan', desc: 'Get a clear quote and reserve your expert well ahead of the exam window.' },
      { num: '03', title: 'Expert Assists', desc: 'On exam day, your matched expert helps you achieve a strong result using secure protocols.' },
      { num: '04', title: 'Get Your Score', desc: 'Review your result with the peace of mind that your privacy was protected throughout.' },
    ],
    faqs: [
      { q: 'Can you help with proctored exams?', a: 'We assist with many proctored formats using secure methods. Share your exam details and we will confirm exactly what is possible for your specific setup.' },
      { q: 'How do you keep it confidential?', a: 'Your identity is encrypted, experts use region-matched secure connections, and all credentials are deleted after the exam. No third party can detect our involvement.' },
      { q: 'What if the exam is timed?', a: 'Timed exams are handled in real time by an expert who is ready during your exam window, so nothing is left to chance.' },
      { q: 'Which subjects can you cover?', a: 'Over 200 subjects including nursing, math, statistics, business, computer science, psychology, and more — always matched to a specialist.' },
    ],
    related: relatedFor('exam-help'),
    ctaH2: 'Exam Coming Up?',
    ctaText: 'Reserve expert exam help now — get a free quote and secure your spot before your exam window opens.',
  },

  'quiz-help': {
    slug: 'quiz-help',
    title: 'Online Quiz Help | Fast Help With Timed & Weekly Quizzes',
    metaDescription: 'Reliable online quiz help from verified experts. Timed and weekly quizzes handled accurately across Canvas, Blackboard, Pearson & more. High scores, quick turnaround, pay weekly.',
    keywords: 'online quiz help, take my online quiz, quiz help, do my quiz, weekly quiz help, canvas quiz help',
    badge: 'Online Quiz Help',
    h1: 'Online Quiz Help for Every Course',
    heroLead: 'Weekly quizzes stacking up? Our experts complete your timed and untimed quizzes accurately and on time, so you never lose easy points to a missed deadline.',
    introH2: 'Accurate Help With Timed and Weekly Quizzes',
    introParas: [
      'Quizzes may be small, but missing them adds up quickly and quietly drags down your grade. EduPilotHelp gives you dependable online quiz help so every quiz is completed accurately and on schedule.',
      'Our experts work directly in Canvas, Blackboard, Pearson, and other platforms, handling timed quizzes in real time and recurring weekly quizzes throughout the term.',
      'Whether it is one tricky quiz or an entire semester of them, we keep your quiz grades where they should be.',
    ],
    featuresH2: 'Why Our Quiz Help Delivers',
    features: COMMON_FEATURES,
    processH2: 'How Quiz Help Works',
    steps: [
      { num: '01', title: 'Share Quiz Details', desc: 'Tell us the subject, platform, timing, and schedule — reviewed at no cost.' },
      { num: '02', title: 'Approve the Plan', desc: 'Get a simple quote covering a single quiz or a full term of weekly quizzes.' },
      { num: '03', title: 'Expert Completes', desc: 'Your matched expert completes each quiz accurately and on time inside your portal.' },
      { num: '04', title: 'Keep Your Grade', desc: 'Watch your quiz scores stay strong with revisions available if ever needed.' },
    ],
    faqs: [
      { q: 'Can you handle timed quizzes?', a: 'Yes. Timed quizzes are completed in real time by an expert ready during your quiz window so nothing is missed.' },
      { q: 'Can you cover all my weekly quizzes?', a: 'Absolutely. We can handle recurring weekly quizzes for an entire course so you never lose points to a missed deadline.' },
      { q: 'Which platforms do you support?', a: 'Canvas, Blackboard, Moodle, Pearson MyLab, McGraw-Hill Connect, ALEKS, and more.' },
      { q: 'How much do quizzes cost?', a: 'Quiz help is priced by volume and subject, with flexible installments. Share your details for a fast, free quote.' },
    ],
    related: relatedFor('quiz-help'),
    ctaH2: 'Never Miss Another Quiz',
    ctaText: 'Get a free quote for single quizzes or a full semester — accurate, on-time quiz help starts here.',
  },

  'discussion-post-help': {
    slug: 'discussion-post-help',
    title: 'Discussion Post Help | Original Posts & Peer Replies',
    metaDescription: 'Discussion post help from verified experts. Thoughtful, original posts and peer replies that meet your rubric and word count — weekly, on time, plagiarism-free. Pay as you go.',
    keywords: 'discussion post help, discussion board help, do my discussion post, online discussion help, weekly discussion post help',
    badge: 'Discussion Post Help',
    h1: 'Discussion Post Help That Sounds Like You',
    heroLead: 'Weekly discussion boards are a hidden time sink. Our experts write thoughtful, original posts and peer replies that hit your rubric and word count — every week, on time.',
    introH2: 'Original Discussion Posts and Replies, Every Week',
    introParas: [
      'Discussion boards demand original thinking every single week, and the peer replies add even more. EduPilotHelp gives you discussion post help that keeps your participation grade high without eating your evenings.',
      'Every post is written from scratch to match your rubric, word count, and course readings, then checked for originality — so it reads naturally and holds up to instructor review.',
      'From initial posts to the required peer responses, we keep your discussion grade consistent all term long.',
    ],
    featuresH2: 'Why Our Discussion Post Help Works',
    features: COMMON_FEATURES,
    processH2: 'How Discussion Post Help Works',
    steps: [
      { num: '01', title: 'Share the Prompt', desc: 'Send the discussion prompt, rubric, word count, and any required readings — reviewed free.' },
      { num: '02', title: 'Approve the Plan', desc: 'Get a quote for single posts or a recurring weekly plan for the whole course.' },
      { num: '03', title: 'Expert Writes', desc: 'A specialist writes original posts and peer replies matched to your course and voice.' },
      { num: '04', title: 'Post On Time', desc: 'Receive your posts before the deadline, with revisions available whenever you need them.' },
    ],
    faqs: [
      { q: 'Are the posts original?', a: 'Yes. Every discussion post and reply is written from scratch to match your prompt and checked for originality before delivery.' },
      { q: 'Can you write the required peer replies too?', a: 'Yes. We handle both initial posts and the required peer responses so your full participation grade is covered.' },
      { q: 'Will it match my writing style?', a: 'We follow your rubric and course readings, and can mirror your tone if you share a previous post.' },
      { q: 'Can you do this every week?', a: 'Absolutely — a recurring weekly plan keeps your discussion grade consistent across the entire term.' },
    ],
    related: relatedFor('discussion-post-help'),
    ctaH2: 'Free Up Your Week',
    ctaText: 'Get a free quote for discussion post help — original weekly posts and replies, handled on time.',
  },

  'essay-writing-help': {
    slug: 'essay-writing-help',
    title: 'Essay Writing Help | Custom, Original Essays On Any Topic',
    metaDescription: 'Professional essay writing help from expert writers. Original, well-structured essays with proper citations, delivered on time. Any topic, any style. Unlimited revisions, pay weekly.',
    keywords: 'essay writing help, essay help, write my essay, custom essay writing, college essay help, research paper help',
    badge: 'Essay Writing Help',
    h1: 'Essay Writing Help From Expert Writers',
    heroLead: 'Need a well-argued, properly cited essay without the all-nighter? Our expert writers craft original essays on any topic, in any style, delivered before your deadline.',
    introH2: 'Custom Essay Writing Help for Every Topic',
    introParas: [
      'A strong essay takes research, structure, and careful editing — time most students simply do not have. EduPilotHelp gives you essay writing help from experienced writers who deliver polished, original work.',
      'Every essay is written from scratch with a clear argument, credible sources, and correct citations in your required style — MLA, APA, Chicago, Harvard, and more — then quality-reviewed before delivery.',
      'From short reflections to full research papers, we help you submit essays you can be proud of, on time.',
    ],
    featuresH2: 'Why Our Essay Writing Help Stands Out',
    features: COMMON_FEATURES,
    processH2: 'How Essay Writing Help Works',
    steps: [
      { num: '01', title: 'Share the Prompt', desc: 'Send the essay question, length, citation style, and deadline — reviewed at no cost.' },
      { num: '02', title: 'Approve the Quote', desc: 'Get a clear price and flexible payment plan before writing begins.' },
      { num: '03', title: 'Writer Crafts It', desc: 'An expert writer researches and drafts your essay, then our team reviews structure and citations.' },
      { num: '04', title: 'Review & Revise', desc: 'Get your essay ahead of the deadline with unlimited revisions within 7 days.' },
    ],
    faqs: [
      { q: 'Is the essay original and plagiarism-free?', a: 'Yes. Every essay is written from scratch and checked for originality before it is delivered to you.' },
      { q: 'Which citation styles do you use?', a: 'MLA, APA, Chicago, Harvard, IEEE, and more — we follow whatever your instructor requires.' },
      { q: 'Can you handle long research papers?', a: 'Yes, from short essays to lengthy research papers with multiple sources and a full reference list.' },
      { q: 'What if I want changes?', a: 'Unlimited revisions within 7 days at no extra cost until the essay meets your standard.' },
    ],
    related: relatedFor('essay-writing-help'),
    ctaH2: 'Essay Due Soon?',
    ctaText: 'Send us the prompt and get a free quote — original, well-cited essay writing help without the stress.',
  },

  'take-my-online-class': {
    slug: 'take-my-online-class',
    title: 'Take My Online Class | Pay an Expert to Take Your Class',
    metaDescription: 'Need someone to take my online class? Verified experts manage your full online class — assignments, quizzes, discussions & exams. 99.1% success rate, pay weekly, 100% confidential.',
    keywords: 'take my online class, pay someone to take my online class, take my class for me, do my online class, online class taker',
    badge: 'Take My Online Class',
    h1: 'Take My Online Class — Handled by Experts',
    heroLead: '“Can someone take my online class?” Yes. A verified expert manages your entire class end to end — assignments, quizzes, discussions, and exams — while you stay fully in control.',
    introH2: 'Let a Verified Expert Take Your Online Class',
    introParas: [
      'Between work and life, keeping up with an online class can feel impossible. EduPilotHelp lets you hand the whole thing to a verified expert who takes your online class from the first week to the final grade.',
      'Your expert logs into your portal, follows your syllabus, and completes every task to your target standard, all admin-reviewed before each deadline. You approve each installment as work is delivered.',
      'With 5,000+ classes completed at a 99.1% success rate, thousands of US students trust us to take their online classes safely and confidentially.',
    ],
    featuresH2: 'Why Students Ask Us to Take Their Online Class',
    features: COMMON_FEATURES,
    processH2: 'How “Take My Online Class” Works',
    steps: [
      { num: '01', title: 'Share Class Access', desc: 'Send your portal login or syllabus so we can scope the full class — free, no commitment.' },
      { num: '02', title: 'Approve Your Plan', desc: 'Get a transparent weekly plan mapped to your class calendar before anything begins.' },
      { num: '03', title: 'Expert Takes Over', desc: 'Your expert manages every task in your portal, quality-reviewed before each deadline.' },
      { num: '04', title: 'Relax & Track', desc: 'Monitor grades in your dashboard and release installments only as work is delivered.' },
    ],
    faqs: [
      { q: 'Can you really take my entire online class?', a: 'Yes. From weekly assignments to the final exam, a verified expert manages your full class while you keep complete visibility and control.' },
      { q: 'Is it safe and confidential?', a: 'Completely. Your identity is encrypted, experts use region-matched secure connections, and credentials are deleted within 48 hours of completion.' },
      { q: 'How do I pay?', a: 'Flexible Stripe installments released only as work is delivered and approved — never a lump sum up front.' },
      { q: 'What grades can I expect?', a: 'We target A and B grades and maintain a 99.1% success rate. If any work falls short of the agreed standard, we revise until you approve.' },
    ],
    related: relatedFor('take-my-online-class'),
    ctaH2: 'Ready for Someone to Take Your Online Class?',
    ctaText: 'Get a free, confidential quote in 60 seconds and hand off the stress of your online class today.',
  },

  'online-course-help': {
    slug: 'online-course-help',
    title: 'Online Course Help | Support for Full Courses & MOOCs',
    metaDescription: 'Online course help for full courses, certifications & MOOCs. Verified experts handle Coursera, edX, Canvas & more — lessons, assignments, quizzes & exams. Pay weekly, confidential.',
    keywords: 'online course help, online course assistance, coursera help, edx help, do my online course, help with online course',
    badge: 'Online Course Help',
    h1: 'Online Course Help for Any Program',
    heroLead: 'Enrolled in more than you can manage? Our experts provide complete online course help — lessons, assignments, quizzes, and exams — across university courses, certifications, and MOOCs.',
    introH2: 'Complete Help With Any Online Course',
    introParas: [
      'Whether it is a degree course, a professional certification, or a self-paced MOOC, online courses demand steady weekly effort. EduPilotHelp gives you online course help so you can progress without falling behind.',
      'Our verified experts work across Coursera, edX, Canvas, Blackboard, and other platforms, completing lessons, graded assignments, quizzes, and final assessments to your target standard.',
      'From a single demanding course to several at once, we keep your progress on track with work delivered before every deadline.',
    ],
    featuresH2: 'Why Choose Our Online Course Help',
    features: COMMON_FEATURES,
    processH2: 'How Online Course Help Works',
    steps: [
      { num: '01', title: 'Share Course Details', desc: 'Tell us the platform, course, and workload, or share access — reviewed free of charge.' },
      { num: '02', title: 'Approve the Plan', desc: 'Get a transparent plan covering your full course with flexible installments.' },
      { num: '03', title: 'Expert Progresses', desc: 'Your expert completes lessons, assignments, and assessments, all quality-reviewed.' },
      { num: '04', title: 'Finish On Time', desc: 'Complete your course on schedule with revisions available whenever you need them.' },
    ],
    faqs: [
      { q: 'Do you support Coursera and edX?', a: 'Yes. We handle Coursera, edX, Canvas, Blackboard, and other course platforms, including certifications and MOOCs.' },
      { q: 'Can you do a full course from start to finish?', a: 'Absolutely. We can complete an entire course — lessons, assignments, quizzes, and final assessments — to your target standard.' },
      { q: 'How is pricing handled?', a: 'Courses are quoted by workload and length with flexible installments, so you pay as work is delivered.' },
      { q: 'Is my enrollment kept private?', a: 'Yes. Your identity and credentials are protected throughout and deleted within 48 hours of completion.' },
    ],
    related: relatedFor('online-course-help'),
    ctaH2: 'Manage Your Course Load the Easy Way',
    ctaText: 'Get a free quote for complete online course help and stay on track from enrollment to certificate.',
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICE_PAGES);

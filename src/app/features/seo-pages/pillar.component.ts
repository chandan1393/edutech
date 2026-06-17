import { SeoService } from '../../core/services/seo.service';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pillar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pillar.component.html',
  styleUrls: ['./pillar.component.scss']
})
export class PillarComponent {
  activeFaq = signal(-1);
  toggle(i: number) { this.activeFaq.set(this.activeFaq() === i ? -1 : i); }

  faqs = [
    { q: 'Is it safe to pay someone to do my online class?', a: 'Yes. EduPilotHelp uses 256-bit SSL encryption to protect all your data. Your portal credentials are only accessible to your assigned expert and our admin quality team. We never share your identity with writers and permanently delete all credentials within 48 hours of class completion. Thousands of US students have trusted us safely every semester.' },
    { q: 'How much does it cost to pay someone to take my online class?', a: 'Starting from $42 per week for standard undergraduate courses. Advanced subjects like Statistics, Aeronautics, or US Tax Law range from $90 to $150 per week. All pricing uses flexible pay-as-you-go Stripe installments. You never pay a lump sum and only pay as work is delivered and approved.' },
    { q: 'Which LMS platforms can your experts navigate?', a: 'Our experts are trained on every major LMS including Canvas, Blackboard, Moodle, D2L Brightspace, Coursera, edX, McGraw-Hill Connect, Pearson MyLab, and more. Whatever portal your institution uses, we navigate it flawlessly from day one.' },
    { q: 'How quickly can you start my class?', a: 'Once you approve the payment plan and confirm your first installment, your expert is assigned within hours and begins immediately — typically the same day. We also have backup experts ready for every class to protect against delays.' },
    { q: 'Can you promise specific grades?', a: 'We target A or B grades on all coursework, and our 99.1% success rate across 5,000+ completed classes reflects consistent delivery. No service can promise institutional grades, but if any deliverable falls short of the agreed standard, we revise until you approve — at zero extra cost.' },
    { q: 'What subjects do you cover?', a: 'Over 200 subjects including Nursing, Computer Science, MBA, Mathematics, Statistics, Psychology, Law, Engineering, Data Science, Finance, English, Biology, Chemistry, History, and all social sciences. Each class is matched to a verified specialist in that exact discipline.' },
    { q: 'Will my university know I am using EduPilotHelp?', a: 'Our experts log into your portal using IP addresses that match your university region, using secure VPN protocols for every class. No third party — including your institution — can detect our involvement. Your privacy is protected at every stage.' },
    { q: 'What happens if I am not satisfied?', a: 'We offer unlimited revisions within 7 days of each delivery. Our admin quality team reviews every deliverable before it reaches you. If we fall short of the agreed standard, we keep working at no additional charge until you are fully satisfied.' },
  ];

  lmsPlatforms = [
    'Canvas', 'Blackboard', 'Moodle', 'D2L Brightspace',
    'Coursera', 'edX', 'McGraw-Hill Connect', 'Pearson MyLab',
    'Aleks', 'WileyPLUS', 'Cengage MindTap', 'WebAssign',
  ];

  subjects = [
    { icon: '🏥', name: 'Nursing & Healthcare', desc: 'Care plans, ATI, NCLEX prep, clinical papers, discussion posts — all handled by RN-qualified experts.' },
    { icon: '💻', name: 'Computer Science', desc: 'Python, Java, JavaScript, SQL, data structures, algorithms, machine learning, and web development.' },
    { icon: '📊', name: 'MBA & Business', desc: 'Case studies, strategy reports, HRM, finance, marketing, accounting, and management coursework.' },
    { icon: '🔢', name: 'Mathematics', desc: 'Calculus, linear algebra, discrete math, quantitative analysis — MyMathLab, ALEKS, WebAssign.' },
    { icon: '📈', name: 'Statistics', desc: 'SPSS, R, Excel-based stats, regression, hypothesis testing, ANOVA, and research methodology.' },
    { icon: '⚙️', name: 'Engineering', desc: 'Mechanical, electrical, civil, chemical — all branches. Lab reports, simulations, project work.' },
    { icon: '🧠', name: 'Psychology', desc: 'Theories, research papers, clinical case studies, DSM-based assessments, and weekly discussion posts.' },
    { icon: '⚖️', name: 'Law & Criminal Justice', desc: 'Legal briefs, policy analysis, criminology papers, contract law, and constitutional law assignments.' },
  ];

  whyPoints = [
    { icon: '✅', title: 'Verified Experts Only', desc: 'Every tutor passes a rigorous subject-matter test and background check before handling any class. No unverified freelancers.' },
    { icon: '🔒', title: '100% Confidential', desc: 'Your identity is encrypted throughout. Writers never know who you are. All portal credentials deleted within 48 hours of completion.' },
    { icon: '💳', title: 'Pay-As-You-Go Plans', desc: 'Stripe-secured installments released only as work is delivered and admin-reviewed. Never a lump sum. Never full upfront.' },
    { icon: '📋', title: 'Admin Quality Review', desc: 'Every deliverable is reviewed by our internal quality team before it reaches you. An extra layer of assurance on every class.' },
    { icon: '🔄', title: 'Unlimited Revisions', desc: 'Not satisfied with any deliverable? Unlimited revisions within 7 days. We keep working until you approve — free of charge.' },
    { icon: '📞', title: '24/7 Live Support', desc: 'Real humans respond every message under 5 minutes on WhatsApp and under 2 hours by email — any timezone, every day.' },
  ];
}

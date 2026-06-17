import { SeoService } from '../../core/services/seo.service';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({ selector: 'app-faq-page', standalone: true, imports: [CommonModule, RouterLink],
  templateUrl: './faq-page.component.html', styleUrls: ['./faq-page.component.scss'] })
export class FaqPageComponent {
  active = signal(-1);
  toggle(i: number) { this.active.set(this.active() === i ? -1 : i); }
  activeCategory = signal('All');

  categories = ['All', 'Safety & Privacy', 'Cost & Pricing', 'Process & Delivery', 'Subjects & LMS', 'Payment & Refunds'];

  faqs = [
    { cat: 'Safety & Privacy', q: 'Is it safe to pay someone to do my online class?', a: 'Yes. EduPilotHelp uses 256-bit SSL encryption throughout our entire platform. Your portal credentials are accessible only to your assigned expert and the admin quality team. We never share your identity with writers, and all credentials are permanently deleted within 48 hours of class completion. You receive a deletion confirmation email.' },
    { cat: 'Safety & Privacy', q: 'Will my university know I am using EduPilotHelp?', a: 'Our experts access your portal using IP addresses verified to match your university region, with secure VPN protocols for every class. No third party, including your institution, can detect our involvement. Your privacy is protected throughout every stage of the class.' },
    { cat: 'Safety & Privacy', q: 'What happens to my login credentials after my class ends?', a: 'All portal credentials are permanently deleted from our systems within 48 hours of your class completion. You receive a deletion confirmation email. We operate a strict zero data retention policy on all student credentials.' },
    { cat: 'Safety & Privacy', q: 'Is my personal information sold or shared?', a: 'Never. Your name, email, phone number, and class details are used solely for service delivery. We operate a strict zero-sharing policy. Your information is never sold, rented, or disclosed to any third party under any circumstances.' },
    { cat: 'Cost & Pricing', q: 'How much does online class help cost?', a: 'Starting from $42 per week for standard undergraduate courses. Advanced subjects like Aeronautics, US Tax Law, or Advanced Statistics range from $90 to $150 per week. All pricing uses flexible pay-as-you-go Stripe installments. You never pay a full lump sum upfront.' },
    { cat: 'Cost & Pricing', q: 'Do I pay everything upfront?', a: 'No. We never require full upfront payment. You pay in installments via Stripe, each installment releasing only after the corresponding work is delivered and admin-reviewed. This protects you completely — you only pay for what has been delivered.' },
    { cat: 'Cost & Pricing', q: 'Can I get a discount for multiple classes?', a: 'Yes. Students enrolling two or more classes simultaneously receive priority assignment and discounted rates. Submit all class details together and mention this in your submission form.' },
    { cat: 'Cost & Pricing', q: 'What happens if I am not satisfied with the work?', a: 'We offer unlimited revisions within 7 days of each delivery. If we fail to deliver work by the agreed deadline, that installment is waived. Full refunds are processed for classes that have not yet started.' },
    { cat: 'Process & Delivery', q: 'How quickly can you start my class?', a: 'Once you approve the payment plan and confirm your first installment, your expert is assigned within hours and begins immediately — typically the same day. We also keep backup experts available for every class to protect against any delays.' },
    { cat: 'Process & Delivery', q: 'How do I receive the completed work?', a: 'All completed assignments are packaged into a secure ZIP file, admin-reviewed, and made available in your student dashboard at least 48 hours before each deadline. You download the package and can review everything before submission.' },
    { cat: 'Process & Delivery', q: 'What if my expert gets sick or becomes unavailable?', a: 'We maintain a dedicated backup expert for every class. If your primary expert is unavailable, a backup with identical subject expertise takes over immediately. Your deadlines are always protected regardless of any internal staffing changes.' },
    { cat: 'Process & Delivery', q: 'Can I communicate with my expert directly?', a: 'Yes. Through your student dashboard you can message your expert at any time. Our admin team monitors all communications to ensure quality, professionalism, and that your specific instructions are followed precisely.' },
    { cat: 'Subjects & LMS', q: 'What subjects does EduPilotHelp cover?', a: 'Over 200 subjects including Nursing, Computer Science, MBA, Mathematics, Statistics, Psychology, Law, Engineering, Data Science, Finance, English, Biology, Chemistry, History, and all social sciences. Each class is matched to a verified specialist in that exact discipline.' },
    { cat: 'Subjects & LMS', q: 'Which LMS platforms do your experts navigate?', a: 'Our experts are trained on every major LMS including Canvas, Blackboard, Moodle, D2L Brightspace, Coursera, edX, McGraw-Hill Connect, Pearson MyLab, Aleks, WileyPLUS, Cengage MindTap, and WebAssign. Whatever your institution uses, we navigate it flawlessly.' },
    { cat: 'Subjects & LMS', q: 'Can you handle programming and coding classes?', a: 'Yes. Our CS experts cover Python, Java, JavaScript, C++, SQL, R, MATLAB, Swift, and all major programming languages. We handle coding labs, algorithms, data structures, machine learning projects, web development, and database design assignments.' },
    { cat: 'Subjects & LMS', q: 'Can you help with nursing ATI, NCLEX prep, and care plans?', a: 'Yes. Our nursing specialists handle care plan documentation, ATI assessments, SBAR reports, clinical reflection papers, NCLEX practice tests, and all nursing school discussion posts and weekly assignments.' },
    { cat: 'Payment & Refunds', q: 'What payment methods do you accept?', a: 'All major credit and debit cards via Stripe — Visa, Mastercard, American Express, and Discover. Stripe uses bank-level encryption. We never store your card details. We do not accept cryptocurrency-only payments — this is a deliberate trust signal.' },
    { cat: 'Payment & Refunds', q: 'Do you offer a grade commitment?', a: 'We target A or B grades on all coursework, and our 99.1% success rate across 5,000+ completed classes reflects consistent delivery. No service can promise institutional grades, but if any deliverable falls below the agreed standard, we revise until you approve at zero extra cost.' },
    { cat: 'Payment & Refunds', q: 'What is your refund policy?', a: 'If we fail to deliver work by the agreed deadline, that installment is waived automatically. Unlimited revisions within 7 days of each delivery are included in all plans. Full refunds are processed for any unstarted class within 48 hours of request.' },
    { cat: 'Payment & Refunds', q: 'Is Stripe secure for online payments?', a: 'Stripe is the payment processor used by Amazon, Google, Shopify, and millions of other platforms. It maintains PCI DSS Level 1 compliance — the highest level of payment security available. Your card details are encrypted and never stored on our servers.' },
  ];

  get filtered() {
    const cat = this.activeCategory();
    return cat === 'All' ? this.faqs : this.faqs.filter(f => f.cat === cat);
  }
}

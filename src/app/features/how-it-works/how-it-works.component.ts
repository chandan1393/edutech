import { SeoService } from '../../core/services/seo.service';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {
  steps = [
    { num: '01', icon: '📋', title: 'Share Your Online Class Details', time: '3 minutes',
      desc: 'Send us your portal login details or simply share the syllabus so we can accurately gauge the effort your class needs. Completely free with zero commitment required.',
      details: ['Course name and subject area', 'Institution and LMS platform (Canvas, Blackboard, Moodle etc.)', 'Class start and end dates', 'Login details or syllabus for an accurate estimate', 'Any special grading requirements or rubrics'] },
    { num: '02', icon: '🎯', title: 'Tell Us the Class Module You Need', time: 'Quick chat',
      desc: 'Let us know exactly which module or portion of the course you need help with — a few quizzes, weekly assignments, discussion posts, or the full class from start to finish.',
      details: ['Pick the exact modules or weeks you need covered', 'Quizzes, discussions, assignments, exams or the full class', 'Tell us your target grade and deadlines', 'Flexible scope — scale up or down anytime', 'Clear estimate before you commit'] },
    { num: '03', icon: '💳', title: 'Pay for Your Online Class', time: 'Flexible',
      desc: 'Choose to pay in full or opt for a flexible partial payment plan for your convenience. Every payment is Stripe-secured, and you only release installments as work is delivered.',
      details: ['Pay in full or in flexible installments', 'Stripe-secured payment links', 'Payment schedule aligned to your class calendar', 'No hidden fees or surprise charges', 'Full refund if you decide not to proceed'] },
    { num: '04', icon: '🔖', title: 'Get Your Tracking Order ID', time: 'Instantly',
      desc: 'Once payment is confirmed, we provide a tracking order ID with all visible deadlines of your class submissions, so you always know exactly what is happening and when.',
      details: ['Unique tracking order ID for your class', 'Every submission deadline clearly visible', 'Subject-matched expert assigned immediately', 'Admin quality team monitors all progress', 'Direct communication via student dashboard'] },
    { num: '05', icon: '📈', title: 'Track Submissions & Grades', time: 'Ongoing',
      desc: 'Stay in touch with our team to track your grades and ensure timely submissions throughout the class. Every deliverable is admin-reviewed and packaged before each deadline.',
      details: ['Real-time progress and grade tracking', 'Work delivered before every deadline', 'Admin quality review on every deliverable', 'Download as ZIP file or review online', 'Request unlimited revisions within 7 days'] },
  ];

  guarantees = [
    { icon: '🎯', title: 'Grade Guarantee', desc: 'We target A or B grades on all coursework. If any deliverable falls below the agreed standard, we revise until you approve — at no extra cost.' },
    { icon: '⏰', title: 'On-Time Delivery', desc: 'Every task delivered minimum 48 hours before its deadline. If we miss — that installment is waived.' },
    { icon: '🔐', title: 'Privacy Protected', desc: '256-bit encryption, zero data retention post-class, your identity never shared with writers at any stage.' },
    { icon: '💳', title: 'Secure Payments', desc: 'Stripe-powered checkout. Pay per installment only after each deliverable is delivered and admin-reviewed.' },
  ];
}

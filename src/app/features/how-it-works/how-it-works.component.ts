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
    { num: '01', icon: '📋', title: 'Submit Your Class Details', time: '3 minutes',
      desc: 'Share your course name, institution, LMS portal URL, class start and end dates, and the types of assignments involved. Completely free with zero commitment required.',
      details: ['Course name and subject area', 'Institution and LMS platform (Canvas, Blackboard, Moodle etc.)', 'Class start and end dates', 'Types of assignments (quizzes, discussions, exams, papers)', 'Any special grading requirements or rubrics'] },
    { num: '02', icon: '💰', title: 'Receive Your Custom Payment Plan', time: 'Within 24 hours',
      desc: 'Our admin team reviews your class details, assesses workload complexity, and sends you a transparent itemized payment plan. Review it, ask questions, and only proceed when satisfied.',
      details: ['Transparent per-installment pricing', 'Payment schedule aligned to your class calendar', 'Stripe-secured payment links for each installment', 'No hidden fees or surprise charges', 'Full refund if you decide not to proceed'] },
    { num: '03', icon: '✍️', title: 'Expert Assigned — Class Begins', time: 'Same day',
      desc: 'Once you approve the plan and confirm your first Stripe installment, your subject-matched expert is assigned immediately. They review your syllabus and handle all coursework.',
      details: ['Verified subject-matter expert matched to your discipline', 'Expert reviews full syllabus and class calendar', 'Admin quality team monitors all progress', 'Backup expert on standby for every class', 'Direct communication via student dashboard'] },
    { num: '04', icon: '📦', title: 'Download Completed Work from Dashboard', time: '48hrs before deadline',
      desc: 'Every completed assignment, quiz, or paper is admin-reviewed and packaged in your secure dashboard before each deadline. Track progress in real time.',
      details: ['All work packaged in your student dashboard', 'Available minimum 48 hours before each deadline', 'Admin quality review on every deliverable', 'Download as ZIP file or review online', 'Request unlimited revisions within 7 days'] },
  ];

  guarantees = [
    { icon: '🎯', title: 'Grade Guarantee', desc: 'We target A or B grades on all coursework. If any deliverable falls below the agreed standard, we revise until you approve — at no extra cost.' },
    { icon: '⏰', title: 'On-Time Delivery', desc: 'Every task delivered minimum 48 hours before its deadline. If we miss — that installment is waived.' },
    { icon: '🔐', title: 'Privacy Protected', desc: '256-bit encryption, zero data retention post-class, your identity never shared with writers at any stage.' },
    { icon: '💳', title: 'Secure Payments', desc: 'Stripe-powered checkout. Pay per installment only after each deliverable is delivered and admin-reviewed.' },
  ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent {
  team = [
    {
      name: 'Dr. Arjun Kapoor', role: 'Founder & Academic Director', avatar: 'AK',
      expertise: 'PhD Business Administration, IIM Ahmedabad',
      bio: 'Former professor with 15+ years of academic experience. Founded EduAssist to help students worldwide manage their online classes with verified expert support.'
    },
    {
      name: 'Priya Nair', role: 'Head of Quality Assurance', avatar: 'PN',
      expertise: 'M.Sc Statistics, IIT Delhi',
      bio: 'Reviews every completed class submission before it reaches the student. 8 years in academic editing — guarantees nothing leaves without her approval.'
    },
    {
      name: 'Rohan Verma', role: 'Lead Tech Expert', avatar: 'RV',
      expertise: 'B.Tech CS, NIT Trichy',
      bio: 'Handles all programming and computer science online classes. Python, Java, JavaScript, SQL, web development — he covers it all start to finish.'
    },
    {
      name: 'Sarah Chen', role: 'International Student Relations', avatar: 'SC',
      expertise: 'MBA International Business, London',
      bio: 'Manages student onboarding across USA, UK, Australia, Canada and Singapore. Makes sure every student\'s class timeline and credentials are handled perfectly.'
    },
  ];

  values = [
    { icon: '📚', title: 'Full Class Coverage', desc: 'We handle your entire online class — every quiz, discussion, project and exam — from the start date to the very last day.' },
    { icon: '🔒', title: 'Complete Confidentiality', desc: 'Your identity and portal credentials are never disclosed. Our writers only know the class — never the student behind it.' },
    { icon: '⏰', title: 'On-Time Delivery', desc: 'We guarantee work is submitted and packaged before each deadline in your class calendar, in your local timezone.' },
    { icon: '💳', title: 'Flexible Installment Payments', desc: 'Pay in installments via Stripe — no lump sum required. Each payment unlocks the next phase of your class.' },
    { icon: '✅', title: 'Admin-Reviewed Before Delivery', desc: 'Every ZIP file is reviewed and approved by our admin team before it becomes available for your download.' },
    { icon: '🌍', title: 'Any Institution, Any Country', desc: 'We support online classes from universities in the USA, UK, Australia, Canada, Europe and beyond — any LMS portal.' },
  ];

  stats = [
    { value: '2018', label: 'Founded', icon: '📅' },
    { value: '5K+',  label: 'Classes Completed', icon: '📚' },
    { value: '200+', label: 'Expert Writers', icon: '✍️' },
    { value: '50+',  label: 'Subjects Covered', icon: '🎓' },
    { value: '15+',  label: 'Countries Served', icon: '🌍' },
    { value: '98%',  label: 'On-Time Rate', icon: '⭐' },
  ];

  process = [
    { icon: '📝', title: 'You Submit Class Details', desc: 'Share your institution, course name, class dates, and LMS portal credentials.' },
    { icon: '💳', title: 'We Set a Payment Plan', desc: 'Admin reviews and creates a custom installment plan. Pay the first installment to begin.' },
    { icon: '✍️', title: 'Expert Takes Over', desc: 'A verified writer is assigned. They log in and manage every task throughout your class duration.' },
    { icon: '📦', title: 'Download Your Work', desc: 'Completed work is reviewed and packaged as a ZIP file, ready for download from your dashboard.' },
  ];
}

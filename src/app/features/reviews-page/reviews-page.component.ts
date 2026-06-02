import { SeoService } from '../../core/services/seo.service';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.scss']
})
export class ReviewsPageComponent implements OnInit {
  reviews = signal<any[]>([]);

  static = [
    { studentName: 'Marcus Thompson', course: 'MBA — Operations Management', location: 'Texas, USA', rating: 5, avatar: 'MT',
      feedbackText: 'I was working full-time and taking two online courses simultaneously. EduPilotHelp handled both and I received A grades in both. The expert was always ahead of deadlines and the admin team was incredibly responsive throughout the entire semester.' },
    { studentName: 'Sarah Mitchell', course: 'Computer Science — Java Programming', location: 'California, USA', rating: 5, avatar: 'SM',
      feedbackText: 'My Java programming class was completely overwhelming. The expert completed every lab, passed all autograder tests and even left comments in the code so I could follow the logic. Genuinely incredible service that is worth every cent.' },
    { studentName: 'Jessica Williams', course: 'Nursing — Healthcare Management', location: 'Florida, USA', rating: 5, avatar: 'JW',
      feedbackText: 'As an international student juggling work and family responsibilities, I needed reliable help with my nursing coursework. EduPilotHelp handled every discussion post and written paper. Delivered before every single deadline without exception.' },
    { studentName: 'James Richardson', course: 'Business Law — Contract Law', location: 'New York, USA', rating: 5, avatar: 'JR',
      feedbackText: 'The pay-as-you-go installment plan made it genuinely affordable. I only paid after each week was delivered and admin-reviewed. A completely transparent process from start to finish and I would highly recommend this service.' },
    { studentName: 'Emily Watson', course: 'Statistics — Applied Regression', location: 'Ohio, USA', rating: 5, avatar: 'EW',
      feedbackText: 'I was skeptical at first but the process was transparent from day one. I received my custom plan the next morning and my expert started that same day. Every single assignment was delivered with days to spare before the deadline.' },
    { studentName: 'Daniel Morrison', course: 'MBA — Strategic Management', location: 'Georgia, USA', rating: 5, avatar: 'DM',
      feedbackText: 'I used EduPilotHelp for a full 16-week MBA course. Weekly case studies, two major research papers, a group project and the final exam — everything came back A-grade. Absolutely worth every single cent I invested in this service.' },
  ];

  constructor(private seo: SeoService, private http: HttpClient) {}

  ngOnInit() {
    this.seo.set({
      title: 'Student Reviews — 4.9 Stars from 500+ Verified Students | EduPilotHelp',
      description: 'Read real verified reviews from 500+ EduPilotHelp students. Average 4.9 out of 5 stars. 99.1% A or B grade rate across 5,000+ completed online classes.',
      canonical: '/reviews'
    });
    this.reviews.set(this.static);
    this.http.get<any[]>(`${environment.apiUrl}/public/feedback`).subscribe({
      next: (r) => { if (r?.length) this.reviews.set(r.map(f => ({ ...f, text: f.feedbackText }))); },
      error: () => {}
    });
  }

  stars(n: number) { return '★'.repeat(Math.max(0, Math.min(5, n || 5))); }
}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="bd-page">
  <div class="bd-loading" *ngIf="loading()"><div class="spinner"></div></div>

  <ng-container *ngIf="!loading() && post()">
    <div class="bd-hero">
      <div class="wrap-mid">
        <a routerLink="/blog" class="back-link">← Back to Blog</a>
        <div class="bd-cat">{{ post().category || 'Online Class Help' }}</div>
        <h1>{{ post().title }}</h1>
        <div class="bd-meta">
          <span>✍️ {{ post().author || 'EduAssist Team' }}</span>
          <span>⏱ {{ post().readTimeMinutes || 5 }} min read</span>
          <span>📅 {{ formatDate(post().createdAt) }}</span>
        </div>
      </div>
    </div>
    <div class="bd-body">
      <div class="wrap-mid">
        <div class="bd-content" [innerHTML]="post().content"></div>
        <div class="bd-cta">
          <h3>Need Help With Your Online Class?</h3>
          <p>Our verified experts handle everything — quizzes, assignments, discussions, and exams. Get a free custom quote in 24 hours.</p>
          <a routerLink="/" class="cta-btn">Get a Free Quote →</a>
        </div>
      </div>
    </div>
  </ng-container>

  <div class="not-found" *ngIf="!loading() && !post()">
    <h2>Article not found</h2>
    <a routerLink="/blog">← Back to Blog</a>
  </div>
</div>
  `,
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  post    = signal<any>(null);
  loading = signal(true);
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  private staticContent: Record<string, any> = {
    'pay-someone-take-online-class-safe': {
      title: 'Pay Someone To Take My Online Class: Is It Safe And Worth It?',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 7,
      createdAt: '2024-10-15T00:00:00',
      content: '<h2>What Does Paying Someone To Take My Online Class Mean?</h2><p>When students search for someone to take their online class, they are looking for a qualified academic expert who can log into their LMS and handle all coursework — quizzes, assignments, discussion posts, exams, and overall grade management.</p><h2>Is It Safe?</h2><p>Safety depends entirely on the provider. EduAssist uses 256-bit SSL encryption. Your credentials are only accessible to your assigned expert and the admin quality team. We never share your identity with writers and delete all credentials after class completion. Thousands of students from the USA, UK, Canada and Australia trust us every semester.</p><h2>How Much Does It Cost?</h2><p>Pricing starts from $42/week for standard coursework. The exact cost depends on subject complexity, number of credit hours, class duration, and workload intensity. Submit your class details and we will send a transparent, itemized installment plan within 24 hours — zero obligation to proceed.</p><h2>What To Look For In A Service</h2><ul><li>Verified subject-matter experts with proven credentials</li><li>Pay-as-you-go installment plans — not full upfront payment</li><li>Admin quality review before deliveries reach you</li><li>256-bit SSL encryption and confidentiality guarantees</li><li>Unlimited revisions policy within 7 days</li><li>24/7 customer support with fast response times</li></ul><h2>Conclusion</h2><p>Paying someone to take your online class is a practical solution for students managing work, family, and academic commitments simultaneously. The key is choosing a verified, secure, and transparent service that prioritizes your results and privacy.</p>'
    },
    'how-to-do-well-in-online-classes': {
      title: 'How To Do Well In Online Classes: 10 Proven Strategies',
      category: 'Study Tips', author: 'EduAssist Team', readTimeMinutes: 8,
      createdAt: '2024-10-10T00:00:00',
      content: '<h2>Why Online Classes Are Challenging</h2><p>Online classes require significantly more self-discipline than traditional in-person courses. Without the structure of scheduled classroom attendance, many students struggle with time management, motivation, and staying on top of multiple assignments simultaneously.</p><h2>1. Create a Dedicated Study Schedule</h2><p>Treat your online class like a physical class. Block out specific hours each week dedicated exclusively to coursework. Consistency is the single most powerful predictor of success in online education.</p><h2>2. Engage Actively in Discussion Forums</h2><p>Participation in discussion boards is often graded. Log in at least three times per week to post original responses and reply meaningfully to at least two classmates. Quality, thoughtful responses always earn more points than brief acknowledgments.</p><h2>3. Read Every Syllabus Carefully</h2><p>The syllabus contains your roadmap for the entire semester. Note every deadline, grading weight, and professor expectation before the first week ends. Missing a major assignment because you did not read the syllabus is one of the most avoidable academic mistakes.</p><h2>4. Use the LMS Dashboard Every Day</h2><p>Log into Canvas, Blackboard, or whatever LMS your institution uses every single day. Professors post announcements, grade updates, and new assignments that are easy to miss if you check infrequently.</p><h2>5. Reach Out For Help Early</h2><p>If you fall behind or find coursework overwhelming, act immediately. Whether that means emailing your professor, visiting a tutoring center, or exploring professional academic support services — waiting until the last week never ends well.</p>'
    },
    'can-you-pay-someone-do-your-online-class': {
      title: 'Can You Pay Someone To Do Your Online Class? Everything You Need To Know',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 6,
      createdAt: '2024-10-05T00:00:00',
      content: '<h2>The Short Answer</h2><p>Yes — thousands of students across the USA, UK, Canada and Australia hire qualified academic experts to handle their online classes every semester. The practice is far more widespread than most people realize, particularly among working adults, parents, and students juggling multiple courses simultaneously.</p><h2>How The Process Works</h2><p>You submit your class details — institution name, portal URL, class dates, and subject area. The service assigns a verified expert in your field who logs into your LMS and handles all coursework according to your requirements. Work is reviewed by an admin quality team before each deliverable is packaged for you.</p><h2>How Much Does It Cost?</h2><p>Pricing typically ranges from $42 to $120+ per week depending on subject complexity, credit hours, and workload intensity. Reputable services offer installment plans so you only pay as work is completed and approved — never everything upfront.</p><h2>Is It Worth It?</h2><p>For students balancing full-time work, caregiving responsibilities, or multiple challenging courses simultaneously, the ROI is often significant. Maintaining a strong GPA while managing real-world commitments has measurable career impact that far exceeds the cost of professional support.</p>'
    },
    'best-online-class-help-services-usa-2024': {
      title: 'Best Online Class Help Services in USA 2024: A Complete Guide',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 6,
      createdAt: '2024-09-28T00:00:00',
      content: '<h2>What To Look For In An Online Class Help Service</h2><p>With hundreds of services claiming to offer online class assistance, knowing what separates legitimate providers from low-quality or fraudulent ones is essential. The five factors that matter most are: expert verification, payment structure, communication quality, confidentiality practices, and revision policies.</p><h2>Top Criteria We Evaluated</h2><ul><li>Expert verification process — do they test subject knowledge?</li><li>Payment security — Stripe or equivalent, never crypto-only</li><li>Installment plan availability — pay as work is delivered</li><li>Admin quality review before delivery</li><li>SSL encryption and data deletion policies</li><li>Response time and support channel availability</li></ul><h2>EduAssist</h2><p>EduAssist stands out for its combination of verified experts, transparent installment pricing starting from $42/week, admin quality review on every deliverable, and 256-bit SSL encryption. Students receive login credentials immediately after submitting their class details, giving them full dashboard access to track progress in real time.</p><h2>What Red Flags To Avoid</h2><p>Avoid any service that demands full payment upfront, offers suspiciously low prices, has no verifiable reviews, or asks you to pay via cryptocurrency exclusively. Legitimate services always offer Stripe-secured installment plans with grade guarantees.</p>'
    },
    'top-lms-platforms-online-classes': {
      title: 'Top LMS Platforms For Online Classes: Canvas vs Blackboard vs Moodle',
      category: 'Subject Guides', author: 'EduAssist Team', readTimeMinutes: 5,
      createdAt: '2024-09-20T00:00:00',
      content: '<h2>What Is An LMS?</h2><p>A Learning Management System (LMS) is the platform your institution uses to host online courses. Understanding your LMS is the first step to succeeding in any online class.</p><h2>Canvas</h2><p>Canvas is widely used by US universities and known for its clean interface. It features modules, quizzes with auto-grading, discussion boards, SpeedGrader, and integrated video tools. Most professors post all assignments inside Modules.</p><h2>Blackboard Learn</h2><p>Blackboard is one of the oldest LMS platforms and is common in large public universities. It can feel complex but all coursework, grade tracking, and communication tools are accessible from the main menu.</p><h2>Moodle</h2><p>Moodle is open-source and highly customizable. Many community colleges and international institutions use it. Assignments, quizzes, forums, and resources are organized by week or topic blocks.</p><h2>D2L Brightspace</h2><p>D2L Brightspace is gaining popularity for its adaptive learning features. The layout is intuitive and the mobile app is excellent for checking grades and announcements on the go.</p><h2>Which LMS Do EduAssist Experts Support?</h2><p>EduAssist experts are trained on all major LMS platforms — Canvas, Blackboard, Moodle, D2L Brightspace, Coursera, edX, McGraw-Hill Connect, Pearson MyLab, and more. Whatever platform your institution uses, we navigate it flawlessly.</p>'
    },
    
  };

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    // Show static post immediately if available
    if (this.staticContent[slug]) {
      this.post.set({ ...this.staticContent[slug], slug });
      this.loading.set(false);
    }
    // Try to get fresh content from API
    if (slug) {
      this.http.get<any>(`${this.api}/public/blogs/${slug}`).subscribe({
        next: (p) => { this.post.set(p); this.loading.set(false); },
        error: () => {
          // If API fails but static exists, already shown — else show not found
          if (!this.staticContent[slug]) this.loading.set(false);
        }
      });
    }
  }

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}

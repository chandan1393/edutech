import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  posts   = signal<any[]>([]);
  loading = signal(true);
  activeCategory = signal('All');

  categories = ['All', 'Online Class Help', 'Study Tips', 'Subject Guides', 'Test Taking', 'Time Management'];

  // Static fallback posts — shown immediately even before API responds
  private staticPosts = [
    {
      id: 1, slug: 'pay-someone-take-online-class-safe',
      title: 'Pay Someone To Take My Online Class: Is It Safe And Worth It?',
      excerpt: 'Millions of students search for ways to manage their online coursework. Here\'s everything you need to know about hiring academic experts to help with your online class.',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 7,
      createdAt: '2024-10-15T00:00:00', published: true, featured: true
    },
    {
      id: 2, slug: 'how-to-do-well-in-online-classes',
      title: 'How To Do Well In Online Classes: 10 Proven Strategies',
      excerpt: 'Online classes can be challenging without face-to-face support. Discover the top 10 proven strategies to excel in any online course from scheduling to active participation.',
      category: 'Study Tips', author: 'EduAssist Team', readTimeMinutes: 8,
      createdAt: '2024-10-10T00:00:00', published: true, featured: true
    },
    {
      id: 3, slug: 'can-you-pay-someone-do-your-online-class',
      title: 'Can You Pay Someone To Do Your Online Class? Everything You Need To Know',
      excerpt: 'Yes, thousands of students hire qualified experts to handle their online classes every semester. But how does it work, what does it cost, and what should you look for?',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 6,
      createdAt: '2024-10-05T00:00:00', published: true, featured: false
    },
    {
      id: 4, slug: 'best-online-class-help-services-usa-2024',
      title: 'Best Online Class Help Services in USA 2024: A Complete Guide',
      excerpt: 'We reviewed the top academic support services available to USA students in 2024. Find the most reliable, affordable, and secure options for online class assistance.',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 6,
      createdAt: '2024-09-28T00:00:00', published: true, featured: false
    },
    {
      id: 5, slug: 'top-lms-platforms-online-classes',
      title: 'Top LMS Platforms For Online Classes: Canvas vs Blackboard vs Moodle',
      excerpt: 'Canvas, Blackboard, Moodle, D2L — which LMS platform does your school use and what should you know about navigating it effectively for your online class?',
      category: 'Subject Guides', author: 'EduAssist Team', readTimeMinutes: 5,
      createdAt: '2024-09-20T00:00:00', published: true, featured: false
    },
    {
      id: 6, slug: 'how-to-choose-reliable-online-class-help',
      title: 'How To Choose A Reliable Online Class Help Service in 2024',
      excerpt: 'With so many services claiming to offer online class help, it can be hard to know who to trust. Here are the key factors to evaluate before choosing any provider.',
      category: 'Online Class Help', author: 'EduAssist Team', readTimeMinutes: 5,
      createdAt: '2024-09-15T00:00:00', published: true, featured: false
    }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Show static posts immediately — no loading flicker
    this.posts.set(this.staticPosts);
    this.loading.set(false);
    // Then try to fetch from API and replace if successful
    this.fetchFromApi();
  }

  private fetchFromApi() {
    this.http.get<any>(`${environment.apiUrl}/public/blogs?page=0&size=20`).subscribe({
      next: (r) => {
        const apiPosts = Array.isArray(r) ? r : (r?.content || []);
        if (apiPosts.length > 0) {
          this.posts.set(apiPosts);
        }
        // If API returns empty, keep showing static posts
      },
      error: () => {
        // API failed — static posts remain visible
      }
    });
  }

  get filteredPosts() {
    const cat = this.activeCategory();
    if (cat === 'All') return this.posts();
    return this.posts().filter(p => p.category === cat);
  }

  openPost(slug: string) {
    this.router.navigate(['/blog', slug]);
  }

  formatDate(d: string) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}

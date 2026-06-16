import { SeoService } from '../../core/services/seo.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss']
})
export class ServicesPageComponent {
  activeService = 0;
  get current() { return this.services[this.activeService]; }

  services = [
    {
      icon: '📚', title: 'Full Online Class', color: '#2563eb', tag: 'Most Popular',
      intro: 'We manage your entire online class from the first day to the last. Share your portal credentials and course details — our expert logs in and handles every quiz, discussion, assignment, and exam throughout the class duration. You enroll once, we deliver everything.',
      features: [
        'Complete class management from start to end date',
        'All quizzes, discussions, assignments, and exams handled',
        'Work submitted directly in your institution\'s portal',
        'Progress tracked via your EduPilotHelp dashboard',
        'Admin-reviewed before each file is delivered',
        'Full payment installment plan — pay as you go',
        'Writer assigned after first installment confirmed',
        'Confidential — your identity never disclosed to writer',
      ],
      subjects: ['Business Administration', 'Psychology', 'Sociology', 'History', 'Political Science', 'Healthcare', 'Education', 'Marketing', 'Economics', 'English Literature', 'Criminal Justice', 'Nursing'],
      process: [
        'Submit your class details — course name, institution, start/end dates, portal URL and credentials',
        'Admin reviews and creates a custom installment payment plan for your class',
        'Pay the first installment — admin assigns a verified expert writer',
        'Expert logs into your portal and manages the class throughout its duration',
        'Completed work is packaged into a ZIP, reviewed by admin, then available to download',
      ],
      turnaround: 'Entire class duration',
    },
    {
      icon: '💻', title: 'Programming & CS Classes', color: '#06b6d4', tag: 'Tech Focused',
      intro: 'All programming and computer science online classes handled by expert developers. Whether it\'s a full-semester Python course, a web development class, or a database management module — our tech experts log in and complete every coding lab, project, and quiz on your behalf.',
      features: [
        'Full online class coverage — Python, Java, JavaScript, C++, SQL and more',
        'All coding labs, projects, and programming quizzes completed',
        'Code is functional, commented, and submission-ready',
        'Data structures, algorithms, web development, databases covered',
        'All tests and unit assessments handled in your portal',
        'Source files delivered in organized ZIP with documentation',
        'Works with all major LMS platforms (Canvas, Blackboard, Moodle, etc.)',
        'Expert developers with 5+ years experience',
      ],
      subjects: ['Python', 'Java', 'JavaScript', 'C / C++', 'SQL & Databases', 'React / Angular', 'Data Science', 'Machine Learning', 'Web Development', 'Cybersecurity', 'Cloud Computing', 'Mobile Development'],
      process: [
        'Share your LMS portal credentials and programming course details',
        'Our tech expert reviews the course syllabus and assignment schedule',
        'Expert logs in and starts completing all programming tasks from week 1',
        'Code is written, tested, and submitted directly in your portal',
        'Final deliverable ZIP includes all source files and documentation',
      ],
      turnaround: 'Entire class duration',
    },
    {
      icon: '🏦', title: 'Business & MBA Classes', color: '#f59e0b', tag: 'High Demand',
      intro: 'Business, finance, accounting, and MBA online classes are among our most requested. Our expert writers handle all case studies, business plans, strategy papers, financial modeling, and group discussions — directly in your portal.',
      features: [
        'Full online class coverage for all business disciplines',
        'Case studies, business plans, and executive reports',
        'Financial modeling and accounting problem sets',
        'MBA strategy papers with real market research',
        'Group discussions and participation tasks managed',
        'APA, Harvard, and Chicago citation standards',
        'Plagiarism-free with Turnitin report available',
        'Works with all online MBA platforms',
      ],
      subjects: ['Business Administration', 'MBA', 'Finance', 'Accounting', 'Marketing Management', 'Operations Management', 'Organizational Behavior', 'Strategic Management', 'Economics', 'Entrepreneurship', 'Human Resources', 'Supply Chain'],
      process: [
        'Provide your business course portal credentials and syllabus details',
        'Expert reviews the class structure — case studies, papers, exams',
        'Writer handles all tasks as they appear in your portal each week',
        'Admin reviews all submissions before marking them delivered',
        'All files organized in a final ZIP available from your dashboard',
      ],
      turnaround: 'Entire class duration',
    },
    {
      icon: '🔬', title: 'Science & Healthcare Classes', color: '#10b981', tag: 'Specialized',
      intro: 'Science and healthcare online classes require deep subject knowledge. Our specialists manage nursing informatics, biology, chemistry, anatomy, and allied health online courses — including patient scenario discussions, lab reports, and clinical assignments.',
      features: [
        'Nursing, allied health, and medical science classes',
        'Biology, chemistry, anatomy and physiology online courses',
        'Clinical case studies and patient scenario discussions',
        'Lab reports and data analysis tasks handled',
        'APA-formatted reflection papers and journals',
        'Healthcare ethics and policy discussions managed',
        'HIPAA-compliant communication practices',
        'Verified healthcare-background experts only',
      ],
      subjects: ['Nursing', 'Allied Health', 'Biology', 'Chemistry', 'Anatomy & Physiology', 'Microbiology', 'Pharmacology', 'Public Health', 'Health Informatics', 'Medical Coding', 'Nutrition', 'Environmental Science'],
      process: [
        'Submit your healthcare or science course portal and class details',
        'Expert with relevant healthcare/science background is selected',
        'All coursework — labs, discussions, exams — handled in your portal',
        'Admin checks each submission for accuracy before delivery',
        'Final ZIP includes all coursework files and records',
      ],
      turnaround: 'Entire class duration',
    },
    {
      icon: '📐', title: 'Mathematics & Statistics', color: '#8b5cf6', tag: 'Exact Sciences',
      intro: 'Mathematics, statistics, and quantitative online courses handled by our specialist problem solvers. Every problem set, statistical analysis, and calculus module is completed with full working shown and submitted directly in your portal.',
      features: [
        'Full online math or statistics class coverage',
        'All homework sets, quizzes, and exams completed',
        'Full working shown — not just final answers',
        'Calculus, algebra, probability, statistics covered',
        'SPSS, R, Excel, and MATLAB tasks handled',
        'Graphs, charts, and data visualizations included',
        'Step-by-step explanations available on request',
        'Works with MyMathLab, WebAssign, Cengage, etc.',
      ],
      subjects: ['Calculus I / II / III', 'Linear Algebra', 'Differential Equations', 'Statistics', 'Probability', 'Discrete Math', 'Business Math', 'SPSS Analysis', 'Biostatistics', 'R Programming', 'Operations Research', 'Number Theory'],
      process: [
        'Share your math/stats portal credentials and class details',
        'Expert reviews the class platform (MyMathLab, WebAssign, etc.)',
        'All problem sets and quizzes completed with full working shown',
        'Admin reviews results before marking each module delivered',
        'Organized ZIP with all completed work and working files',
      ],
      turnaround: 'Entire class duration',
    },
    {
      icon: '⚖️', title: 'Law & Social Sciences', color: '#ec4899', tag: 'Humanities',
      intro: 'Law, criminal justice, social work, and political science online classes are handled by our expert writers with strong humanities backgrounds. All discussion boards, case analyses, policy papers, and legal briefs are managed in your portal.',
      features: [
        'Law school and paralegal online course coverage',
        'Criminal justice, public policy, and social work classes',
        'Legal briefs, case analyses, and court opinion summaries',
        'Discussion board participation managed weekly',
        'Policy papers with current events and legal research',
        'Proper legal citation (Bluebook, APA) used throughout',
        'Weekly participation requirements fully met',
        'Works across all major law school LMS platforms',
      ],
      subjects: ['Criminal Justice', 'Constitutional Law', 'Business Law', 'International Law', 'Social Work', 'Political Science', 'Public Administration', 'Psychology', 'Criminology', 'Sociology', 'Philosophy', 'Ethics'],
      process: [
        'Provide your law or social science course portal login and details',
        'Expert with relevant humanities/legal background is assigned',
        'All weekly tasks — discussions, papers, exams — completed in portal',
        'Admin verifies each submission meets the course requirements',
        'Final ZIP with all completed coursework delivered to your dashboard',
      ],
      turnaround: 'Entire class duration',
    },
  ];

  scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

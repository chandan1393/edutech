import { Component, Input, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() enrollmentId!: number;
  @Input() context!: string;        // 'STUDENT_ADMIN' or 'ADMIN_WRITER'
  @Input() title: string = 'Chat';
  @Input() currentUserRole: string = '';
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  private api = inject(ApiService);
  private auth = inject(AuthService);

  messages = signal<any[]>([]);
  newMessage = signal('');
  sending = signal(false);
  loading = signal(true);
  private pollInterval: any;
  private shouldScroll = false;

  ngOnInit() {
    this.loadMessages();
    this.markRead();
    this.pollInterval = setInterval(() => this.loadMessages(), 4000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadMessages() {
    this.api.getChatMessages(this.enrollmentId, this.context).subscribe({
      next: (msgs: any[]) => {
        const prev = this.messages().length;
        this.messages.set(msgs || []);
        if ((msgs?.length || 0) > prev) {
          this.shouldScroll = true;
          this.markRead();
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  markRead() {
    this.api.markChatRead(this.enrollmentId, this.context).subscribe({ error: () => {} });
  }

  sendMessage() {
    const msg = this.newMessage().trim();
    if (!msg || this.sending()) return;
    this.sending.set(true);
    this.api.sendChatMessage(this.enrollmentId, this.context, msg).subscribe({
      next: () => {
        this.newMessage.set('');
        this.sending.set(false);
        this.loadMessages();
        this.shouldScroll = true;
      },
      error: () => this.sending.set(false)
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  isMe(msg: any): boolean {
    const me = this.auth.currentUser();
    // Compare role — if user's role matches msg sender role
    return me?.role === msg.senderRole;
  }

  formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      + ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  getRoleLabel(role: string): string {
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_WRITER') return 'Writer';
    return 'Student';
  }

  private scrollToBottom() {
    try { this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' }); } catch {}
  }
}

// src/app/components/chat/chat.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthenticatedUserInterface } from 'src/app/interfaces/authenticated-user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  public onlineUsers: any[] = [];
  @Output() chatClosed = new EventEmitter<void>();

  toggleChat() {
    this.chatClosed.emit();
  }

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(private socketService: SocketService) {}
  private messageService = inject(MessagesService);
  public user!: AuthenticatedUserInterface;
  private authService = inject(AuthService);
  public isLoadingMessages = true;


  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if(user) this.user = user;
    this.loadMessages();
    this.scrollToBottom();
    this.socketService.connect();
    this.socketService.onMessage().subscribe((message: any) => {
      this.messages.push(message);
      setTimeout(() => this.scrollToBottom(), 10); 
    });

    this.socketService.onUsersOnline().subscribe((users: any[]) => {
      this.onlineUsers = users; 
  });
  }
  

  loadMessages() {
    this.messageService.getAll().subscribe({
      next: (res) => {
        if (res.data) {
          this.messages = res.data;
          this.isLoadingMessages = false;
          setTimeout(() => this.scrollToBottom(), 0);
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoadingMessages = false;
      },
    });
  }
  

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return; 
    }
  
    this.socketService.sendMessage({
      message: this.newMessage.trim(),
      user: this.user.id, 
    });
  
    this.newMessage = ''; 
    setTimeout(() => this.scrollToBottom(), 10);
  }
  

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
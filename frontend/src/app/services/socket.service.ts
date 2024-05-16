import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private endpoint = 'http://localhost:3000';
  private authService = inject(AuthService);

  constructor() {
    this.initSocket();
  }

  initSocket(): void {
    const token = localStorage.getItem('token');
    this.socket = io(this.endpoint, {
      query: { token },
    });

    this.startPingPong();
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(data: any) {
    this.socket.emit('some_event', data);
  }

  onUsersOnline(): Observable<any[]> {
    return new Observable((observer) => {
        this.socket.on('users online', (users: any[]) => {
            observer.next(users);
        });
    });
}


  onMessage() {
    return new Observable((observer) => {
      this.socket.on('message_saved', (data: any) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('message_saved');
      };
    });
  }

  private startPingPong(): void {
    setInterval(() => {
      const token = localStorage.getItem('token');
      if (this.socket.connected && token) {
        this.socket.emit('ping_with_token', token);
      }
    }, 30000);

    this.socket.on('pong', (data) => {
      if (data.status === 'invalid') {
        console.warn('Token inválido o expirado. Desconectando...');
        this.disconnect();
        this.authService.logout();
      }
    });
  }
}

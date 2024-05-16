import { Component, OnInit, inject } from '@angular/core';
import { AuthenticatedUserInterface } from 'src/app/interfaces/authenticated-user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css'],
})
export class LayoutPageComponent implements OnInit {
  private authService = inject(AuthService);
  public user!: AuthenticatedUserInterface;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) this.user = user;

    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }


  logout() {
    this.authService.logout();
  }


  isChatOpen = false;

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }
  

}

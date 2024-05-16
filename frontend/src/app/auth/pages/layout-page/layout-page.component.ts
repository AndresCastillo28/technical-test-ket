import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { SignInComponent } from '../../components/sign-in/sign-in.component';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css'],
})
export class LayoutPageComponent { 

  public dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(SignUpComponent);
  }

  openDialogSignIn(): void {
    const dialogRef = this.dialog.open(SignInComponent);
  }

}

import { Component, Input, ViewChild } from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { SearchComponent } from '../search/search.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    MatButton,
    MatDivider,
    SearchComponent,
    RouterLink,
  ],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  @Input() isAuthenticated!: boolean;
  @Input() logout!: () => void;

  handleOpen() {
    document.body.classList.toggle('scroll-lock');
  }

  closes() {
    this.drawer.close();
    console.log('closed');
  }
}

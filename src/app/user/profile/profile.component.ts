import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  imageUrl: string = '';
  userName: string = '';
  constructor(private auth: AuthService) {}

  ngOnInit() {
    if (localStorage.getItem('profileImage')) {
      this.imageUrl = localStorage.getItem('profileImage')!;
    }

    if (localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName')!;
    }
  }

  async changeImage(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    const selectedFiles = inputElement.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      await this.auth.updateProfile(file);
      this.imageUrl = localStorage.getItem('profileImage')!;
    }
  }
}

import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  username: string | null = '';

  imageValue = 'https://api.multiavatar.com/Binx Bond.svg';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.username = localStorage.getItem('currentUser');
    }
  }

  onChange($event: any) {
    const file = $event.target.files[0];

    const formdata = new FormData();
    formdata.append('image', file);

    this.auth.updateProfile(formdata);
  }
}

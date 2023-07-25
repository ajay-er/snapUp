import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

interface IUser {
  name: string;
  email: string;
  age: number;
  phoneNumber: string;
  imageUrl: string;
  _id: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private adminAuth: AdminService) {}

  loading = false;

  users: IUser[] = [];
  searchUser = '';

  ngOnInit() {
    this.loading = true;
    this.adminAuth.getUsers().subscribe((res) => {
      this.users = res.users;
      console.log(this.users);
      
      this.loading = false;
    });
  }
}

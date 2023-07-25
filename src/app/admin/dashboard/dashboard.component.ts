import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

interface IUser {
  name: string;
  email: string;
  age: number;
  phoneNumber: string;
  imageUrl: string;
  _id: string;
  markedForDeletion?: boolean; 
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  markedForDeletion: boolean = false;
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

  deleteUser($event: Event, id: any) {
    $event.preventDefault();
    this.markedForDeletion = true;

    this.adminAuth.deleteUser(id).subscribe({
      next: (res: any) => {
        console.log(res);
        const index = this.users.findIndex(user => user._id === id);
        if (index !== -1) {
          this.users.splice(index, 1);
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}

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
    
    this.adminAuth.users$.subscribe((users: any) => {
      this.users = users;
      this.loading = false;
    });

    this.adminAuth.totalCount$.subscribe(total => {
      console.log(total,'total');
      
      this.total = total;
    })
  }

  deleteUser($event: Event, id: any) {
    $event.preventDefault();
    this.markedForDeletion = true;

    this.adminAuth.deleteUser(id).subscribe({
      next: (res: any) => {
        this.markedForDeletion = false;

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

  //pagination
  currentPage: number = 1;
  total: number = 0;
  limit: number = 5;
  changePage(page: number) {
    sessionStorage.setItem('selectedPage', page.toString());
    this.currentPage = page;
    this.adminAuth.getUsers(page,this.limit).subscribe((res:any) => {
      this.total = res.total;
      this.users = res.users;

    })
  }

}

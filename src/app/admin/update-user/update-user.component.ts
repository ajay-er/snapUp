import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent {
  constructor(
    private adminAuth: AdminService,
    private router: ActivatedRoute,
    private route:Router
  ) {}

  inSubmission = false;

  userId: string = '';

  imageUrl = '';
  userName = '';
  userEmail = '';
  userAge = '';

  ngOnInit() {
    this.userId = this.router.snapshot.paramMap.get('id')!;
    this.adminAuth.getUserData(this.userId).subscribe((res) => {
      const user = res.user;
      this.imageUrl = user.imageUrl;
      this.userName = user.name;
      this.userEmail = user.email;
      this.userAge = user.age;
    });
  }

  showAlert = false;
  alertMsg = 'Please wait! user account is being updating.';
  alertColor = 'blue';

  public async onSubmit() {

    this.showAlert = true;
    this.alertMsg = 'Please wait! user account is being updating.';
    this.alertColor = 'blue';

    this.inSubmission = true;

    const userData = {
      name: this.userName,
      age: this.userAge,
      email: this.userEmail,
      id: this.userId,
    };

    this.adminAuth.updateUserData(userData).subscribe({
      next: (res) => {
        console.log(res);

        this.alertMsg = 'Account updated successfully!';
        this.alertColor = 'green';

        this.route.navigateByUrl('/admin/dashboard');
        
      },
      error: (error) => {
        if (error.error?.message) {
          this.alertMsg = error.error.message;
          this.alertColor = 'red';
        } else {
          this.alertMsg = 'An unexpected Error occured.Please try again later!';
          this.alertColor = 'red';
        }
        this.inSubmission = false;
        return;
      },
    });
  }

  

}

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css']
})
export class SignInComponent {
  isLoading = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      
      const { email, password } = this.form.value;
      
      if (email && password) {
        const result = this.authService.login(email, password);
        
        if (result.success) {
          this.router.navigate(['/products']);
        } else {
          alert(result.message);
        }
      }
      
      this.isLoading = false;
    }
  }
}
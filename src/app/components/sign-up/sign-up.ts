import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css']
})
export class SignUpComponent {
  isLoading = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    acceptTerms: new FormControl(false, [Validators.requiredTrue])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.valid && this.passwordsMatch()) {
      this.isLoading = true;
      
      const { name, email, password } = this.form.value;
      
      if (name && email && password) {
        const result = this.authService.register(name, email, password);
        
        if (result.success) {
          alert(result.message);
          this.router.navigate(['/products']);
        } else {
          alert(result.message);
        }
      }
      
      this.isLoading = false;
    } else {
      if (!this.passwordsMatch()) {
        alert('Las contraseñas no coinciden');
      } else {
        alert('Por favor completa todos los campos correctamente y acepta los términos.');
      }
    }
  }

  passwordsMatch(): boolean {
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;
    return password === confirmPassword;
  }
}
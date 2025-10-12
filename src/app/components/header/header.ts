import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  cartItems = 0;
  totalPrice = 0;
  logoError = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateCartInfo();
  }

  updateCartInfo(): void {
    this.cartItems = this.cartService.getTotalItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToCart(): void {
    alert('Funcionalidad del carrito - Próximamente');
  }

  goToProfile(): void {
    alert('Funcionalidad del perfil - Próximamente');
  }

  handleImageError(event: any): void {
    console.log('Error cargando logo:', event);
    this.logoError = true;
    event.target.style.display = 'none';
  }
}
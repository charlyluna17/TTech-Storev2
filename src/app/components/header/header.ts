import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  cartItems = 0;
  totalPrice = 0;
  logoError = false;
  searchTerm = '';

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
    this.searchTerm = ''; // Limpiar búsqueda al ir al home
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      // Navegar a productos con el término de búsqueda
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchTerm } 
      });
    }
  }

  onSearchInput(): void {
    // Búsqueda en tiempo real solo si estamos en la página de productos
    if (this.router.url === '/products' && this.searchTerm.trim()) {
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchTerm },
        replaceUrl: true // No agregar al historial
      });
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    if (this.router.url === '/products') {
      this.router.navigate(['/products'], { 
        queryParams: {} // Limpiar parámetros
      });
    }
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
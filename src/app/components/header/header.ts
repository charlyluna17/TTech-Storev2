import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItems = 0;
  totalPrice = 0;
  logoError = false;
  searchTerm = '';
  
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del carrito
    this.cartSubscription.add(
      this.cartService.totalItems$.subscribe(totalItems => {
        this.cartItems = totalItems;
        console.log('Header - Cart items updated:', totalItems);
      })
    );

    this.cartSubscription.add(
      this.cartService.totalPrice$.subscribe(totalPrice => {
        this.totalPrice = totalPrice;
        console.log('Header - Total price updated:', totalPrice);
      })
    );

    // Cargar valores iniciales
    this.updateCartInfo();
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.cartSubscription.unsubscribe();
  }

  updateCartInfo(): void {
    this.cartItems = this.cartService.getTotalItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  goToHome(): void {
    this.router.navigate(['/']);
    this.searchTerm = '';
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchTerm } 
      });
    }
  }

  onSearchInput(): void {
    if (this.router.url === '/products' && this.searchTerm.trim()) {
      this.router.navigate(['/products'], { 
        queryParams: { search: this.searchTerm },
        replaceUrl: true
      });
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    if (this.router.url === '/products') {
      this.router.navigate(['/products'], { 
        queryParams: {}
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
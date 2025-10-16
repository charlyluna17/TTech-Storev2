import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem, CustomerInfo } from '../../services/cart';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  customerInfo: CustomerInfo = {
    name: '',
    email: '',
    address: '',
    phone: ''
  };
  showCustomerForm = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
    this.loadCartItems();
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.loadCartItems();
  }

  getSubtotal(): number {
    return this.cartService.getSubtotal();
  }

  getTax(): number {
    return this.cartService.getTax();
  }

  getTotal(): number {
    return this.cartService.getTotalPrice();
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  proceedToCheckout(): void {
    this.showCustomerForm = true;
  }

  generateInvoice(): void {
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!this.isCustomerInfoValid()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    console.log('Generando factura...');
    
    // Generar la factura y guardarla en el servicio
    const invoice = this.cartService.generateInvoice(this.customerInfo);
    console.log('Factura generada:', invoice);
    
    // Limpiar el carrito
    this.cartService.clearCart();
    
    // Navegar a la página de factura
    this.router.navigate(['/invoice']).then(success => {
      if (success) {
        console.log('Navegación exitosa a invoice');
      } else {
        console.error('Error en navegación a invoice');
        alert('Error al generar la factura. Por favor intenta nuevamente.');
      }
    }).catch(error => {
      console.error('Error en navegación:', error);
      alert('Error al navegar a la factura: ' + error.message);
    });
  }

  isCustomerInfoValid(): boolean {
    return !!this.customerInfo.name && 
           !!this.customerInfo.email && 
           !!this.customerInfo.address && 
           !!this.customerInfo.phone;
  }

  getStockStatus(stock: number): string {
    if (stock > 10) return 'high';
    if (stock > 0) return 'low';
    return 'out';
  }
}
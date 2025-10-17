import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
      this.loadCartItems();
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.loadCartItems();
  }

  getSubtotal(): number {
    return this.cartService.getSubtotal();
  }

  getTax(): number {
    return this.cartService.getTaxes(); // Cambié a getTaxes() que existe
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

    // Generar la factura usando el método que agregué al servicio
    const invoice = (this.cartService as any).generateInvoice(this.customerInfo);
    
    // Limpiar el carrito
    this.cartService.clearCart();
    
    // Navegar a la página de factura
    this.router.navigate(['/invoice']);
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
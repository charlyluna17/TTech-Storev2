import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';

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

interface Invoice {
  id: string;
  date: Date;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerInfo?: CustomerInfo;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private storageKey = 'ttech-store-cart';

  // Subjects para observar cambios
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private totalPriceSubject = new BehaviorSubject<number>(0);

  // Observables públicos
  public cartItems$ = this.cartItemsSubject.asObservable();
  public totalItems$ = this.totalItemsSubject.asObservable();
  public totalPrice$ = this.totalPriceSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
    this.updateObservables();
  }

  // === MÉTODOS DEL CARRITO ===
  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
      }
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    
    this.saveCartToStorage();
    this.updateObservables(); // ← Actualizar observables
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCartToStorage();
    this.updateObservables(); // ← Actualizar observables
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item && quantity > 0 && quantity <= item.product.stock) {
      item.quantity = quantity;
      this.saveCartToStorage();
      this.updateObservables(); // ← Actualizar observables
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.precio * item.quantity), 0);
  }

  getTaxes(): number {
    return this.getSubtotal() * 0.13;
  }

  getTotalPrice(): number {
    return this.getSubtotal() + this.getTaxes();
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
    this.updateObservables(); // ← Actualizar observables
  }

  // === MÉTODOS DE FACTURA ===
  generateInvoice(customerInfo?: CustomerInfo): Invoice {
    const invoice: Invoice = {
      id: 'TT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      date: new Date(),
      items: [...this.cartItems],
      subtotal: this.getSubtotal(),
      tax: this.getTaxes(),
      total: this.getTotalPrice(),
      customerInfo: customerInfo || {
        name: 'Cliente TTech Store',
        email: 'cliente@ttechstore.com',
        address: 'San Salvador, El Salvador',
        phone: '(503) 1234-5678'
      }
    };

    localStorage.setItem('ttech-store-invoice', JSON.stringify(invoice));
    return invoice;
  }

  // === MÉTODOS PRIVADOS ===
  private updateObservables(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.totalItemsSubject.next(this.getTotalItems());
    this.totalPriceSubject.next(this.getTotalPrice());
  }

  private saveCartToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem(this.storageKey);
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.updateObservables(); // ← Actualizar al cargar desde storage
    }
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Invoice {
  id: string;
  date: Date;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerInfo?: CustomerInfo;
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private storageKey = 'ttech-store-cart';
  private currentInvoice: Invoice | null = null;
  
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
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else if (quantity <= item.product.stock) {
        item.quantity = quantity;
        this.saveCartToStorage();
        this.updateObservables(); // ← Actualizar observables
      }
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

  getTax(): number {
    return this.getSubtotal() * 0.13;
  }

  getTotalPrice(): number {
    return this.getSubtotal() + this.getTax();
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartToStorage();
    this.updateObservables(); // ← Actualizar observables
  }

  generateInvoice(customerInfo?: CustomerInfo): Invoice {
    const invoice: Invoice = {
      id: this.generateInvoiceId(),
      date: new Date(),
      items: [...this.cartItems],
      subtotal: this.getSubtotal(),
      tax: this.getTax(),
      total: this.getTotalPrice(),
      customerInfo
    };
    
    this.currentInvoice = invoice;
    return invoice;
  }

  getCurrentInvoice(): Invoice | null {
    return this.currentInvoice;
  }

  clearCurrentInvoice(): void {
    this.currentInvoice = null;
  }

  private generateInvoiceId(): string {
    return 'INV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

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
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Invoice, CartService } from '../../services/cart';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.html',
  styleUrls: ['./invoice.css']
})
export class InvoiceComponent implements OnInit {
  invoice: Invoice | null = null;
  currentDate = new Date();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener la factura del servicio
    this.invoice = this.cartService.getCurrentInvoice();
    
    console.log('Invoice component loaded');
    console.log('Invoice data:', this.invoice);

    if (!this.invoice) {
      console.log('No invoice found, redirecting to cart...');
      // Si no hay factura, redirigir al carrito después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/cart']);
      }, 2000);
      return;
    }

    console.log('Invoice displayed successfully');
  }

  printInvoice(): void {
    window.print();
  }

  newOrder(): void {
    // Limpiar la factura actual
    this.cartService.clearCurrentInvoice();
    // Redirigir a productos
    this.router.navigate(['/products']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
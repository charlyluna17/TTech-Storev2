import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface InvoiceItem {
  product: any;
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
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerInfo?: CustomerInfo;
}

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Intentar obtener la factura del localStorage
    const storedInvoice = localStorage.getItem('ttech-store-invoice');
    
    if (storedInvoice) {
      this.invoice = JSON.parse(storedInvoice);
      // Convertir la fecha string a objeto Date
      if (this.invoice && this.invoice.date) {
        this.invoice.date = new Date(this.invoice.date);
      }
      console.log('Invoice loaded:', this.invoice);
    } else {
      console.log('No invoice found');
      // Redirigir al carrito después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/cart']);
      }, 3000);
    }
  }

  printInvoice(): void {
    window.print();
  }

  newOrder(): void {
    // Limpiar la factura del localStorage
    localStorage.removeItem('ttech-store-invoice');
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
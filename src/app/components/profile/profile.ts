import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';;

export interface Purchase {
  id: string;
  date: Date | string;
  total: number;
  items: number;
  status: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  recentPurchases: Purchase[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadRecentPurchases();
    this.isLoading = false;
  }

  private loadRecentPurchases(): void {
    this.recentPurchases = [
      {
        id: 'ORD-001',
        date: new Date('2024-01-15'),
        total: 299.99,
        items: 3,
        status: 'Entregado'
      },
      {
        id: 'ORD-002', 
        date: new Date('2024-01-10'),
        total: 159.50,
        items: 2,
        status: 'En camino'
      },
      {
        id: 'ORD-003',
        date: new Date('2024-01-05'),
        total: 89.99,
        items: 1,
        status: 'Entregado'
      }
    ];
  }

  // Método para formatear fechas
  getFormattedDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Método para calcular total gastado
  getTotalSpent(): number {
    return this.recentPurchases.reduce((total, purchase) => total + purchase.total, 0);
  }

  // Método para contar compras completadas
  getCompletedPurchases(): number {
    return this.recentPurchases.filter(p => p.status === 'Entregado').length;
  }

  editProfile(): void {
    alert('Funcionalidad de editar perfil - Próximamente');
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
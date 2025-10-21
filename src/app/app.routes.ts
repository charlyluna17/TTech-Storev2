import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';
import { InvoiceComponent } from './components/invoice/invoice';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'invoice', component: InvoiceComponent },
  
  // NUEVAS RUTAS DE AUTH
  { 
    path: 'login', 
    loadComponent: () => import('./components/sign-in/sign-in').then(m => m.SignInComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('.//components/sign-up/sign-up').then(m => m.SignUpComponent)
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent)
  },
  
  { path: '**', redirectTo: '/products' }
];
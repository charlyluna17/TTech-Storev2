import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,  FormsModule, SearchComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategory = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.selectedCategory = '';
    this.productService.searchProducts(searchTerm).subscribe({
      next: (products) => {
        this.filteredProducts = products;
      },
      error: (error) => {
        console.error('Error searching products:', error);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.searchTerm = '';
    
    if (!category) {
      this.filteredProducts = this.products;
      return;
    }

    this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        this.filteredProducts = products;
      },
      error: (error) => {
        console.error('Error filtering products:', error);
      }
    });
  }

addToCart(product: Product): void {
  this.cartService.addToCart(product);
  // El header se actualizará automáticamente gracias al observable
  alert(`${product.nombre} agregado al carrito!`);
}

  viewDetails(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  getCategories(): string[] {
    const categories = this.products.map(product => product.categoria);
    return [...new Set(categories)];
  }
}
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { CarouselComponent } from '../carousel/carousel';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CarouselComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  featuredProducts: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategory = '';
  showAllProducts = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    
    // Escuchar cambios en los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
        this.performSearch(this.searchTerm);
      } else {
        this.searchTerm = '';
        this.showProductsBasedOnView();
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.featuredProducts = this.getFeaturedProducts(products);
        this.showProductsBasedOnView();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  showProductsBasedOnView(): void {
    if (this.searchTerm) {
      this.performSearch(this.searchTerm);
    } else {
      this.filteredProducts = this.showAllProducts ? this.allProducts : this.featuredProducts;
    }
  }

  performSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.selectedCategory = '';
    
    if (!searchTerm.trim()) {
      this.filteredProducts = this.showAllProducts ? this.allProducts : this.featuredProducts;
      return;
    }

    this.productService.searchProducts(searchTerm).subscribe({
      next: (products) => {
        this.filteredProducts = products;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.filteredProducts = [];
      }
    });
  }

  getFeaturedProducts(products: Product[]): Product[] {
    return products.slice(0, 6);
  }

  showAll(): void {
    this.showAllProducts = true;
    this.filteredProducts = this.searchTerm ? this.filteredProducts : this.allProducts;
  }

  showFeatured(): void {
    this.showAllProducts = false;
    this.filteredProducts = this.searchTerm ? this.filteredProducts : this.featuredProducts;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.searchTerm = '';
    
    // Limpiar parámetros de URL al filtrar por categoría
    this.router.navigate(['/products'], { queryParams: {} });
    
    if (!category) {
      this.filteredProducts = this.showAllProducts ? this.allProducts : this.featuredProducts;
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
  
  // Pequeña animación de confirmación
  const button = event?.target as HTMLElement;
  if (button) {
    button.classList.add('added');
    setTimeout(() => {
      button.classList.remove('added');
    }, 500);
  }
  
  alert(`${product.nombre} agregado al carrito!`);
}

  viewDetails(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  getCategories(): string[] {
    const categories = this.allProducts.map(product => product.categoria);
    return [...new Set(categories)];
  }
}
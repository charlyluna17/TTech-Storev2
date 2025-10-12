import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'assets/data/products.json';
  private products: Product[] = [];

  constructor(private http: HttpClient) {}

  loadProducts(): Observable<Product[]> {
    if (this.products.length > 0) {
      return of(this.products);
    }

    return this.http.get<Product[]>(this.productsUrl).pipe(
      map(products => {
        this.products = products;
        return products;
      }),
      catchError(error => {
        console.error('Error loading products:', error);
        return of([]);
      })
    );
  }

  getProducts(): Observable<Product[]> {
    if (this.products.length > 0) {
      return of(this.products);
    }
    return this.loadProducts();
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(product => product.id === id))
    );
  }

  searchProducts(term: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => {
        if (!term.trim()) {
          return products;
        }
        return products.filter(product => 
          product.nombre.toLowerCase().includes(term.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(term.toLowerCase()) ||
          product.categoria.toLowerCase().includes(term.toLowerCase())
        );
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product => 
        product.categoria.toLowerCase() === category.toLowerCase()
      ))
    );
  }
}
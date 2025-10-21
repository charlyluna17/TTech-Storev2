import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<User | null>(null);
  private readonly USERS_KEY = 'techstore_users';
  private readonly CURRENT_USER_KEY = 'techstore_current_user';
  
  isAuthenticated$ = this.isAuthenticated.asObservable();
  currentUser$ = this.currentUser.asObservable();

  constructor() {
    this.checkStoredAuth();
  }

  // REGISTRO
  register(name: string, email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    
    // Verificar si el email ya existe
    if (users.find(user => user.email === email)) {
      return { success: false, message: 'Este email ya está registrado.' };
    }
    
    // Crear nuevo usuario
    const newUser: User = {
      id: this.generateId(),
      name,
      email,
      password,
      createdAt: new Date()
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    // Auto-login después del registro
    this.login(email, password);
    
    return { success: true, message: '¡Cuenta creada exitosamente!' };
  }

  // LOGIN
  login(email: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Guardar usuario en sessionStorage
      sessionStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      this.isAuthenticated.next(true);
      this.currentUser.next(user);
      return { success: true, message: '¡Bienvenido!' };
    } else {
      return { success: false, message: 'Email o contraseña incorrectos.' };
    }
  }

  // LOGOUT
  logout(): void {
    sessionStorage.removeItem(this.CURRENT_USER_KEY);
    this.isAuthenticated.next(false);
    this.currentUser.next(null);
  }

  // Verificar autenticación almacenada
  private checkStoredAuth(): void {
    const storedUser = sessionStorage.getItem(this.CURRENT_USER_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.isAuthenticated.next(true);
      this.currentUser.next(user);
    }
  }

  // Obtener usuarios del localStorage
  private getUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  // Guardar usuarios en localStorage
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Generar ID único
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  // Verificar si está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }
}
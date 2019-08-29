import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<Product[]>(`${this.config.API}/products`);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public API = 'http://localhost:4000/';

  constructor() { }
}

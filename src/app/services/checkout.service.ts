import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = "http://localhost:8282/api/checkout/purchase";
  
  constructor() { }
}

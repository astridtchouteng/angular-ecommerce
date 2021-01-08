import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem) {

    //check if we already have the item in our cart
    let alreadyExistsIncart: boolean = false;
    let existingCartItem: CartItem = undefined;

    // find the item in the cart based on the item id
    if(this.cartItems.length > 0) {

      for(let item of this.cartItems) {
        if (item.id === cartItem.id) {
          existingCartItem = item;
          break;
        } 
      }

      // check if we found item
      alreadyExistsIncart = (existingCartItem != undefined)
    }

    if(alreadyExistsIncart) {
      // increament quantity
      existingCartItem.quantity ++;
    }
    else {
      //just add the item
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let item of this.cartItems) {
      totalPriceValue += item.unitPrice * item.quantity;
      totalQuantityValue += item.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }


}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  // reference to web browser's session storage
  // once a web browser tab is closed, then data is no longer available
  storage: Storage = sessionStorage;

  // if you want to persist your data and survives once the browser if restarts, use local storage
   // storage: Storage = localStorage

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { 
    // read data from storage

    let data = JSON.parse(this.storage.getItem("cartItems"));

    if(data != null) {
      this.cartItems = data;

      // compute totals based on the data that is read from storage

      this.computeCartTotals;
    }
  }

  addToCart(cartItem: CartItem) {

    //check if we already have the item in our cart
    let alreadyExistsIncart: boolean = false;
    let existingCartItem: CartItem = undefined;

    // find the item in the cart based on the item id
    if(this.cartItems.length > 0) {

      // Array.find returns the forst element in an array
      // returns undefined if it can't find the item
      existingCartItem = this.cartItems.find(item => item.id === cartItem.id);

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

    // publish the news values to all the subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // persist cart data on my browser
    this.persistCartItems();

  }

  persistCartItems() {
    this.storage.setItem("cartItems", JSON.stringify(this.cartItems));
  }

  decrementQuantity(cartItem: CartItem) {

    // the cartItem is pass by reference
    cartItem.quantity--;
    if(cartItem.quantity === 0) {
      this.removeItem(cartItem)
    }
    else {
      this.computeCartTotals();
    }

  }

  removeItem(cartItem: CartItem) {

    const indexItem = this.cartItems.findIndex(
      item => item.id === cartItem.id
    );

    // remove item at the given index
    if(indexItem > -1) {
      this.cartItems.splice(indexItem, 1);
      this.computeCartTotals();
    }


  }


}

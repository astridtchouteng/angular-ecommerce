import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.buildFormGroup();
  }

  buildFormGroup() {

    // form group is a collection of formgroup and formControl
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName : [' '],
        lastName: [' '],
        email : [' ']
      }),
      shippingAddress: this.formBuilder.group({
        city : [' '],
        country: [' '],
        street : [' '],
        state: [' '],
        zipCode: [' ']
      }),
      billingAddress: this.formBuilder.group({
        city : [' '],
        country: [' '],
        street : [' '],
        state: [' '],
        zipCode: [' ']
      }),
      creditCard: this.formBuilder.group({
        cardType : [' '],
        nameOnCard: [' '],
        cardNumber : [' '],
        securityCode: [' '],
        expirationMonth: [' '],
        expirationYear: [' ']
      }),

    });

    this.cartService.computeCartTotals();
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  copyShippingAddressToBillingAddress(event) {
    
    if(event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value)
    }
    else {
      // clear all the file in the billingAddress group
      this.checkoutFormGroup.controls.billingAddress.reset();


    }
  }

}

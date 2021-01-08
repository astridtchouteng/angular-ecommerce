import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { CartService } from 'src/app/services/cart.service';
import { PopulateFormService } from 'src/app/services/populate-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  creditcardYears: number[] = [];
  creditcardMonth: number[] = [];

  countries: Country[] = [];

  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private populateFormService: PopulateFormService) { }

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

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )
    this.cartService.computeCartTotals();

    // populate creadit card month
    const startMonth: number = new Date().getMonth() + 1;

    this.populateFormService.getMonths(startMonth).subscribe(
      data => this.creditcardMonth = data
    );

    // populate credit card years
    this.populateFormService.getYears().subscribe(
      data => this.creditcardYears = data
    );

    // populate countries
    this.populateFormService.getCountries().subscribe(
      data => {
        console.log("countries " + JSON.stringify(data));
        this.countries = data;
      } 
    )
  }

  onSubmit() {
    console.log('Price ' + this.totalPrice);
    console.log('Quantity ' + this.totalQuantity);
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  copyShippingAddressToBillingAddress(event) {
    
    if(event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value)
    }
    else {
      // clear all the form control in the billingAddress group
      this.checkoutFormGroup.controls.billingAddress.reset();

    }
  }

  updateMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.populateFormService.getMonths(startMonth).subscribe(
      data => this.creditcardMonth = data
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { PopulateFormService } from 'src/app/services/populate-form.service';
import { ShopValidator } from 'src/app/validators/shop-validator';

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

  stateForShippingAddress: State[] = [];
  stateForBillingAddress: State[] = [];

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
        firstName : new FormControl('', [Validators.required, Validators.minLength(5), ShopValidator.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(5), ShopValidator.notOnlyWhiteSpace]),
        email : new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
      }),
      shippingAddress: this.formBuilder.group({
        city : new FormControl('', [Validators.required, Validators.minLength(5), ShopValidator.notOnlyWhiteSpace]),
        country: new FormControl('', [Validators.required]),
        street : new FormControl('', [Validators.required, Validators.minLength(5), ShopValidator.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(5), ShopValidator.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        city : new FormControl('', [Validators.required, Validators.minLength(5), ShopValidator.notOnlyWhiteSpace]),
        country: new FormControl('', [Validators.required]),
        street : new FormControl('', [Validators.required, Validators.minLength(5), ShopValidator.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(5), ShopValidator.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType : new FormControl('' , [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(5), ShopValidator.notOnlyWhiteSpace]),
        cardNumber : new FormControl('', [Validators.pattern('[0-9]{16}'), Validators.required]),
        securityCode: new FormControl('', [Validators.pattern('[0-9]{3}'), Validators.required]),
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

    if( this.checkoutFormGroup.invalid) {
      // touching all fields and triggers the display of the error messages
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);

  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() { return this.checkoutFormGroup.get('customer.lastName');}
  get email() { return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street')};
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city')};
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state')};
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country')};
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode')};

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street')};
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city')};
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state')};
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country')};
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode')};

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType')};
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard')};
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber')};
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode')};


  copyShippingAddressToBillingAddress(event) {
    
    if(event.target.checked) {
      // bug fix for states
      this.stateForBillingAddress = this.stateForShippingAddress;
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value)
    }
    else {
      // clear all the form control in the billingAddress group
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.stateForBillingAddress = [];

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

  getState(nameFormGroup: string) {

    const formGroup = this.checkoutFormGroup.get(nameFormGroup);

    const countrycode = formGroup.value.country.code;

    this.populateFormService.getSatesByCountryCode(countrycode).subscribe(
      data => {

        if(nameFormGroup === 'shippingAddress') {
          this.stateForShippingAddress = data;
        }
        else {
          this.stateForBillingAddress = data;
        }

        formGroup.get("state").setValue(data[0]);
      }
    );
  }

}

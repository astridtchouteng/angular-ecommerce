import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
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
    private populateFormService: PopulateFormService,
    private checkoutService: CheckoutService,
    private  router: Router) { }

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
        this.countries = data;
      } 
    )
  }

  onSubmit() {
    console.log("Submit your form");

    if( this.checkoutFormGroup.invalid) {
      // touching all fields and triggers the display of the error messages
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order: Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems: CartItem[] = this.cartService.cartItems;

    // create orderItems from cartitems
    let orderItems: OrderItem [] = cartItems.map( item => new OrderItem(item));

    // set up purchase
    let purchase: Purchase = new Purchase();

    // populate purchase - customer
    let customer: Customer = new Customer();
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    
    // country and state are the array. We need to convert it object to pass it to Purchase DTO
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    
    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;

    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order
    purchase.order = order;

    // populate puchase - orderItems
    purchase.orderItems = orderItems;

    // call checkout service
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`)
        
          // resert cart
          this.resertCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }
      }
    );

  }


  resertCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");
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

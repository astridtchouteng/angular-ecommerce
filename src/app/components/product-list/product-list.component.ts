import { GetResponseProducts, ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] =  [];
  currentCategoryId: number = 1;
  currentCategoryName!: any;
  searchMode: boolean = false ;
  previousCategoryId: number = 1;
  previousKeyword: string = "";

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }


  listProducts() {

    const theKeyword = this.route.snapshot.paramMap.get('keyword');

    if(theKeyword != null) {
      //search products using keyword
      this.searchMode = true;
      this.handleSearchProducts(theKeyword);
    }
    else {
      this.searchMode = false;
      this.handleListProducts();
    }
    
  }

  handleSearchProducts(theKeyword: string) {

    // if we have a different keyword than previous
    // then set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword)
                       .subscribe(this.processResult());
  }

  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId = this.route.snapshot.paramMap.get("id");
    const hasCategoryName = this.route.snapshot.paramMap.get("name");

    if (hasCategoryId == null) {
      //not category id available ... default to category id 1
      if (hasCategoryName == null)
        this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    } else {
      this.currentCategoryId = +hasCategoryId;
      this.currentCategoryName = hasCategoryName;
    }

    // if we have a different category id than previous
    // the set the PageNumber back to 1

    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    } 

    this.previousCategoryId = this.currentCategoryId;



    this.productService.getProductsListPaginate(this.thePageNumber - 1, this.thePageSize,
                                                this.currentCategoryId)
                        .subscribe(this.processResult());
    
  }

  processResult() {
    return (data: GetResponseProducts) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(product: Product) {
    console.log(`Adding to Cart: ${product.name} , ${product.unitPrice}`);


    // TODO
  }

}

import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products!: Product[];
  currentCategoryId!: number;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this .listProducts();
    })
  }

  
  listProducts() {

    // check if "id" parameter is available
    const hasCategoryId = this.route.snapshot.paramMap.get("id");

    if (hasCategoryId == null) {
      this.currentCategoryId = 1;
    } else {
      this.currentCategoryId = +hasCategoryId;
    }

    this.productService.getProductsList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}

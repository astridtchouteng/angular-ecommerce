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
  currentCategoryName!: any;

  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }


  listProducts() {

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

    this.productService.getProductsList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}

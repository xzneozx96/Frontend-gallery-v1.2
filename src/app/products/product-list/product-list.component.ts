import { Component, OnInit, OnDestroy } from '@angular/core';
import { PicturesService } from '../../shared/service/pictures.service';
import { Picture } from 'src/app/shared/model/picture.model';
import { GetCarouselHeightService } from 'src/app/shared/service/getCarouselHeight.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterService } from '../../shared/service/filter.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  picturesList: Picture[] = [];
  filteredList: Picture[] = [];

  queryParamSub: Subscription;

  searchParent: string = null;
  pageSize = 9;
  page = 1;

  searchedContent: string = null;

  constructor(
    private pictureService: PicturesService,
    private getCarouselHeight: GetCarouselHeightService,
    private filterService: FilterService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCarouselHeight.getCarouselHeight(0);
    document.getElementById('fixed').classList.add('sticky');

    this.pictureService.getData().subscribe((data) => {
      this.filteredList = data;
      this.picturesList = data;
    });

    this.queryParamSub = this.route.queryParams.subscribe((params: Params) => {
      const searchedByCate = params.category;
      const searchedByArtist = params.artist;
      if (searchedByCate) {
        this.searchedContent = searchedByCate;
        this.filteredList = this.picturesList.filter((value) => {
          return value.category === searchedByCate;
        });
      } else if (searchedByArtist) {
        this.searchedContent = searchedByArtist;
        this.filteredList = this.picturesList.filter((value) => {
          return value.artist === searchedByArtist;
        });
      } else {
        this.searchedContent = null;
        this.filteredList = this.picturesList;
      }
    });

    this.filterService.searchByTypingSubject.subscribe((content: string) => {
      this.filteredList = this.picturesList.filter((value) => {
        return (
          value.artist.toLowerCase() === content.toLowerCase() ||
          value.category.toLowerCase() === content.toLowerCase()
        );
      });
    });
    this.filterService.searchByPriceSubject.subscribe((content) => {
      this.filteredList = this.picturesList.filter((value) => {
        return (
          +value.price >= content.minPrice && +value.price <= content.maxPrice
        );
      });
    });
  }

  ScrollOnTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  ngOnDestroy(): void {
    this.queryParamSub.unsubscribe();
  }

  removeFilter(): void {
    this.router.navigate(['list']);
  }
}

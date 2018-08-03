import { Component, OnInit, Input } from '@angular/core';
import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

import { Book } from '../../../model/book';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit {
  @Input() books: Book[];

  book: Book;
  uids: String[];
  loader: boolean;

  constructor(
    public bkData: BooksDataService,
    public payoutService: PayoutService
  ) { }


  ngOnInit() {
    console.log(this.books);
    for (let i = 0; i < 9; i++) {
      this.book = this.books[i];
      // this.book.image = `url(${this.book.image})`;
      // console.log(this.book.image);
      // this.book.image = this.book.image.slice(3, this.book.image.length - 1);
      // console.log(this.book.image);
    }
  }
}

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
    for (let i = 0; i < 9; i++) {
      this.book = this.books[i];
    }
  }
}

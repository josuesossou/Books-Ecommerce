import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { IsbnBooksService } from '../../../services/isbn-books.service';
import { Book } from '../../../model/book';
import { Querry } from '../../../model/book';
import { BooksDataService } from '../../../services/books-data.service';
import { PayoutService } from '../../../services/payout.service';

@Component({
  selector: 'app-sell-book',
  templateUrl: './sell-book.component.html',
  styleUrls: ['./sell-book.component.css']
})
export class SellBookComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private bkSubscription: Subscription;

  books: Book[];
  bookObject: Book;
  querryObject: Querry;
  inputText: string;
  indexbk: number;
  total: number;
  loader = false;
  isBckLoaded = false;
  userName: string;

  constructor(
    public isbnBooks: IsbnBooksService,
    public bookData: BooksDataService,
    public payoutService: PayoutService
  ) { }

  ngOnInit() {
    this.authSubscription = this.payoutService.auth().subscribe(auth => {
      this.userName = auth.displayName;
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  // search for books on Isbn
  onSearching() {
    this.books = [];
    if (this.inputText === undefined) {
      this.loader = false;
      this.isBckLoaded = false;
    } else {
      this.loader = true;
      this.isBckLoaded = false;
      this.indexbk = 0;

      this.bkSubscription = this.isbnBooks.getBooks(this.inputText).subscribe(booksQuerried => {
        this.querryObject = booksQuerried;

        this.bookSlides(0);
      }, error => {
        this.loader = false;
        this.isBckLoaded = false;
      });
    }
  }

  // viewing next set in books array
  nexSlide() {
    if (window.innerWidth >= 992) {
      this.bookSlides(this.indexbk += 6);
    } else {
      this.bookSlides(this.indexbk += 4);
    }
  }
  // viewing previous books in books array
  prevSlide() {
    if (window.innerWidth >= 992) {
      this.bookSlides(this.indexbk -= 6);
    } else {
      this.bookSlides(this.indexbk -= 4);
    }
  }
  // looping through books in the books array
  bookSlides(indx) {

    this.books = [];
    this.total = this.querryObject.books.length - 1;

    if (indx >= this.querryObject.books.length) {
      indx = this.querryObject.books.length - 1;
      this.indexbk = this.querryObject.books.length - 1;
    }
    if (indx < 0) {
      indx = 0;
      this.indexbk = 0;
    }

    for (let i = indx; i < this.querryObject.books.length; i++) {

      const book = this.querryObject.books[i];
      this.bookObject = {
        authors: book.authors,
        date_published: book.date_published,
        image: `url(${book.image})`,
        isbn: book.isbn,
        isbn13: book.isbn13,
        title: book.title,
        title_long: book.title_long
      };

      this.books.push(this.bookObject);

      if (this.books.length === 6 && window.innerWidth >= 992) {
        break;
      } else if (this.books.length === 4 && window.innerWidth < 992) {
        break;
      }
    }

    this.loader = false;
    this.isBckLoaded = true;
    this.bkSubscription.unsubscribe();
  }

  // add book to firebase database
  addBooks(book: Book) {
    this.bookData.booksInventory(book.isbn, book);
  }

}

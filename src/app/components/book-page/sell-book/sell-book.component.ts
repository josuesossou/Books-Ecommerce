import { Component, OnInit } from '@angular/core';
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
export class SellBookComponent implements OnInit {

  books:Book[];
  bookObject:Book;
  querryObject:Querry;
  inputText:string;
  indexbk:number;
  total:number;
  loader:boolean = false;
  isBckLoaded:boolean = false;
  userName:string;
  // background = "url('https://images.isbndb.com/covers/25/59/9780061152559.jpg')";


  constructor(
    public isbnBooks:IsbnBooksService,
    public bookData:BooksDataService,
    public payoutService:PayoutService
  ) { }

  ngOnInit() {
    this.payoutService.auth().subscribe(auth=>{
      this.userName = auth.displayName;
    })
  }

  ///search for books on Isbn 
  onSearching(){
    this.books = [];
    if(this.inputText === undefined){
      this.loader = false;
      this.isBckLoaded = false;
    } else {
      this.loader = true;
      this.isBckLoaded = false;
      this.indexbk = 0;
      this.isbnBooks.getBooks(this.inputText).subscribe(booksQuerried => {

        this.querryObject = booksQuerried;
  
        this.bookSlides(0);
        
      }, error => {
        this.loader = false;
        this.isBckLoaded =false
      })

    }
    
  }

  //viewing next set in books array
  nexSlide(){
    if(window.innerWidth >=992){
      this.bookSlides(this.indexbk += 6);
    }else {
      this.bookSlides(this.indexbk += 4);
    }
 
  }
  //viewing previous books in books array
  prevSlide(){
    if(window.innerWidth >=992){
      this.bookSlides(this.indexbk -= 6);
    }else {
      this.bookSlides(this.indexbk -= 4)
    }
  }
  //looping through books in the books array
  bookSlides(indx){

    this.books = [];
    this.total = this.querryObject.books.length - 1;

    if(indx >= this.querryObject.books.length){
      indx = this.querryObject.books.length - 1;
      this.indexbk = this.querryObject.books.length - 1;
    }
    if(indx < 0){
      indx = 0;
      this.indexbk = 0;
    }

    for(let i = indx; i < this.querryObject.books.length; i++){

      let book = this.querryObject.books[i];
      this.bookObject = {
        authors:book.authors,
        date_published:book.date_published,
        image:`url(${book.image})`,
        isbn:book.isbn,
        isbn13:book.isbn13,
        overview:book.overview,
        title:book.title,
        title_long:book.title_long
      }
      
      this.books.push(this.bookObject);

      if(this.books.length == 6 && window.innerWidth >=992){
        break
      } else if(this.books.length == 4 && window.innerWidth < 992) {
        break
      }
    }

    this.loader = false;
    this.isBckLoaded = true;
  }

  //add book to firebase database
  addBooks(book:Book){
    this.bookData.booksInventory(book.isbn, book);
  }

}

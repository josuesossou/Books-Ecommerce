import { Component, OnInit } from '@angular/core';
import { PayoutService } from '../../../../services/payout.service';
import { BooksDataService } from '../../../../services/books-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../../../model/book';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.css']
})
export class ReturnBookComponent implements OnInit {

  constructor(
    private payoutservice: PayoutService,
    private bookDataService: BooksDataService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) { }

  book: Book;
  address: any[];
  code: string;
  carrier: string;

  ngOnInit() {
    const id  = this.route.snapshot.params['id'];
    const uid = this.payoutservice.userId;

    console.log(uid);

    console.log(id);
    if (uid) {
      this.bookDataService.getPurchasedBook(uid, id).subscribe(book => {
          this.book = JSON.parse(book.payload.val());
          console.log(book.payload.val());
          this.bookDataService.getReturnAddress(this.book.uid).subscribe(address => {
            console.log(address);
            this.address = address;
          });
      });
    }
  }

  
}

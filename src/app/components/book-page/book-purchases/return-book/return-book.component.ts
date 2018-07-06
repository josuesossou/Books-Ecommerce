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

    if (uid) {
      this.bookDataService.getPurchasedBook(uid, id).subscribe(book => {
        this.book = JSON.parse(book.payload.val());

        this.bookDataService.getReturnAddress(this.book.uid).subscribe(address => {
          this.address = address;
        });
      });
    }
  }

  onsubmit() {
    if (!this.carrier || !this.code) {
      return this.flashMessage.show('Choose a carrier and enter tracking code', {cssClass: 'alert-danger', timeout: 4000});
    }

    if (this.carrier === 'USPS') {
      this.book.returnCarrierLink = 'https://tools.usps.com/go/TrackConfirmAction_input';
    } else if (this.carrier === 'UPS') {
      this.book.returnCarrierLink = 'https://www.ups.com/tracking/tracking.html';
    } else if (this.carrier === 'Fedex') {
      this.book.returnCarrierLink = 'https://www.fedex.com/apps/fedextrack/?action=track';
    } else if (this.carrier === 'DHL Express') {
      this.book.returnCarrierLink = 'http://www.dhl.com/en/express/tracking.html';
    } else {
      return this.flashMessage.show('Choose a carrier and enter tracking code', {cssClass: 'alert-danger', timeout: 4000});
    }

    this.book.requestRefunds = true;
    this.book.isReturn = true;
    this.book.returnCode = this.code;

    this.bookDataService.updateBookSold(this.book.isbn, this.book, this.book.uid);
  }
}

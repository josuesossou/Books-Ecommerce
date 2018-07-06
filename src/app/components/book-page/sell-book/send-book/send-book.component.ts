import { Component, OnInit } from '@angular/core';
import { PayoutService } from '../../../../services/payout.service';
import { BooksDataService } from '../../../../services/books-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../../../model/book';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-send-book',
  templateUrl: './send-book.component.html',
  styleUrls: ['./send-book.component.css']
})
export class SendBookComponent implements OnInit {

  constructor(
    private payoutservice: PayoutService,
    private bookDataService: BooksDataService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService,
  ) { }

  book: Book;
  address: any;
  code: string;
  carrier: string;

  ngOnInit() {
    const id  = this.route.snapshot.params['id'];
    const uid = this.payoutservice.userId;

    console.log(id);
    this.bookDataService.getForSaleBook(id, uid).subscribe(book => {
      this.book = JSON.parse(book.payload.val());
      console.log(this.book);
      this.bookDataService.getBuyerAddress(this.book.buyerUid).subscribe((address: any) => {
        this.address = JSON.parse(address);
        console.log(this.address);
      });
    });

  }

  onsubmit() {
    if (!this.code || !this.carrier) {
      return this.flashMessage.show('Choose a carrier and enter tracking code', {cssClass: 'alert-danger', timeout: 4000});
    }

    if (this.carrier === 'USPS') {
      this.book.carrierLink = 'https://tools.usps.com/go/TrackConfirmAction_input';
    } else if (this.carrier === 'UPS') {
      this.book.carrierLink = 'https://www.ups.com/tracking/tracking.html';
    } else if (this.carrier === 'Fedex') {
      this.book.carrierLink = 'https://www.fedex.com/apps/fedextrack/?action=track';
    } else if (this.carrier === 'DHL Express') {
      this.book.carrierLink = 'http://www.dhl.com/en/express/tracking.html';
    } else {
      return this.flashMessage.show('Choose a carrier and enter tracking code', {cssClass: 'alert-danger', timeout: 4000});
    }

    this.book.isForSale = false;
    this.book.isSent = true;
    this.book.code = this.code;
    this.book.carrier = this.carrier;

    this.bookDataService.sendCarrierCode(this.book.buyerUid, this.book.isbn, this.book);

    this.bookDataService.bookSold(this.book.isbn, this.book);

    this.bookDataService.removeFromStore(this.book.isbn).then(() => {
      this.router.navigate(['/sell-book']);
    });
  }

}

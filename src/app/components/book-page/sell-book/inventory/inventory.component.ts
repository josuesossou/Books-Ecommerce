import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { FlashMessagesService } from 'angular2-flash-messages';

import { BooksDataService } from '../../../../services/books-data.service';
import { PayoutService } from '../../../../services/payout.service';

import { Book } from '../../../../model/book';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  invtoryBooks:Book[];
  book:Book;

  constructor(
    public bkData:BooksDataService,
    public payoutService:PayoutService,
    public route:ActivatedRoute,
    public location:Location,
    public flashMessage:FlashMessagesService
  ) { }

  ngOnInit() {
    this.payoutService.auth().subscribe(auth=>{
      this.bkData.getInventoryBooks(auth.uid).subscribe(data=>{
        this.invtoryBooks = [];
        for(let d of data){
          this.book = JSON.parse(d.payload.val());
          this.book.isForSale = false;
          this.invtoryBooks.unshift(this.book);
        }
      })
    });
  }

  //remove a book from the inventory
  removeBck(id){
    this.bkData.removeFromInv(id).then(()=>{
      this.ngOnInit();
    })
  }

  //pushing books to the store
  sellBook(book){
    
    if(book.price == undefined){
      this.flashMessage.show('Enter an amount', {cssClass:'alert-danger', timeout:1000});
    }else if(book.price <= 1){
      this.flashMessage.show('Enter an amount higher than $1', {cssClass:'alert-danger', timeout:1000});
    }else{
      this.bkData.sellBook(book.isbn, book).then(()=>{
        this.book.isForSale = false;
        this.removeBck(book.isbn);
      });
      
    }
    
  }

}
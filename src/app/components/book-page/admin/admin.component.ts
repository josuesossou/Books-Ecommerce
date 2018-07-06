import { Component, OnInit } from '@angular/core';
import { BooksDataService } from '../../../services/books-data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private bookData: BooksDataService
  ) { }
  registerUsers: any[];
  booksSold: any[] = [];

  ngOnInit() {
    // this.bookData.getRegisteredUsers().subscribe(registerUsers => {
    //   this.registerUsers = registerUsers;

    //   registerUsers.forEach((user: any) => {
    //     this.bookData.getBookSold(user.uid).subscribe(bookSold => {

    //       if (bookSold.length > 0) {
    //         this.booksSold.push(bookSold);
    //       }
    //     });
    //   });
    // });
  }

}

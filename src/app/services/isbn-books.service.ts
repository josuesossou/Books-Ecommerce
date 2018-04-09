import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Querry } from '../model/book';

const headerOptions = {
  headers:new HttpHeaders({
    "Content-Type": "application/json",
    "X-API-Key": "qlQcdBo1KP6Pj7vGt69L5qwrSvHhO6x4yD1fcuk1"
  })
}

@Injectable()
export class IsbnBooksService {

    
  // apiKey = 'qlQcdBo1KP6Pj7vGt69L5qwrSvHhO6x4yD1fcuk1';

  //&index1=isbn&value1=[ISBN]/book/9780134093413'

  constructor(public http:HttpClient, ) { }

  getBooks(searchable):Observable<Querry> {
    let url = 'https://api.isbndb.com/books/' + searchable;
    return this.http.get<Querry>(url, headerOptions)
  }


}

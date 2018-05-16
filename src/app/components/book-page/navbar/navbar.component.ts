import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PayoutService } from '../../../services/payout.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  storeLink:boolean;
  isbn;
  uid;
  loginDetails:string;
  isAuth:boolean;

  constructor(
    public route:ActivatedRoute,
    public location:Location,
    public router:Router,
    public payoutService:PayoutService
  ) {}

  ngOnInit() {
    this.payoutService.auth().subscribe(auth =>{
      if(!auth || auth.isAnonymous) {
        this.loginDetails = '';
        this.isAuth = false;
      } else{
        this.loginDetails = auth.email 
        this.isAuth = true  
      }
    });
  }

  buyerLogin() {

  }

  logout() {
    this.payoutService.logout();
    this.router.navigate(['/']);
  }

}

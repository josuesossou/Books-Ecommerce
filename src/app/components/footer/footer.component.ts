import { Component, OnInit } from '@angular/core';
import { PayoutService } from '../../services/payout.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {


  loginDetails:string;
  isAuth:boolean;
  turkeyLink:boolean;

  constructor(
    private payoutService:PayoutService,
    private router:Router
  ) { }

  ngOnInit() {
    this.payoutService.auth().subscribe(auth =>{
      if(auth && auth.displayName != null){
        this.loginDetails = auth.email 
        this.isAuth = true       
      } else{
        this.loginDetails = '';
        this.isAuth = false;
      }
    });
    this.router.events.subscribe(event => {
      if (location.pathname === '/perfect-turkey' || location.pathname === '/video') {
        this.turkeyLink = true
      } else {
        this.turkeyLink = false
      }
    })
  }

  logout(){
    this.payoutService.logout();
    this.router.navigate(['/']);
    location.reload();
  }

}

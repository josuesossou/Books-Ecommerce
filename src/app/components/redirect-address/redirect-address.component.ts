import { Component, OnInit, HostListener } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { PayoutService } from '../../services/payout.service';
import { Router } from '@angular/router';
import { Client } from '../../model/interface';
import { Location } from '@angular/common';
import { Charges } from '../../model/interface';


@Component({
  selector: 'app-redirect-address',
  templateUrl: './redirect-address.component.html',
  styleUrls: ['./redirect-address.component.css']
})
export class RedirectAddressComponent implements OnInit {

  client:Client = {
    fullname:'',
    addLine1:'',
    addLine2:'',
    city:'',
    state:'',
    zip:'',
    country:''
  }
  test:Charges;
  id:string;

  constructor(
    public flashMessagesService:FlashMessagesService,
    public router:Router,
    public payoutService:PayoutService,
    private location:Location) { 

    }

  ngOnInit() {
    this.payoutService.auth().subscribe((auth)=>{ 
      this.id = auth.uid   
    })
  }

  updateClient({value, valid}:{value:Client, valid:boolean}){


    this.payoutService.checkCharge(this.id).subscribe(charges =>{


      if(charges.length == 0){

        this.flashMessagesService.show('Payement was canceled', {cssClass:'alert-danger', timeout:5000});
        this.router.navigate(['']);

      }else{
       
        for (var i = 0; i < charges.length; i++) {

          this.test = charges[i];

           if (this.test.amount == 1999 && this.test.charge.amount_refunded == 0 && this.test.charge.paid) {

            if (!valid) {
              this.flashMessagesService.show('Please fill in all fields', {cssClass:'alert-danger', timeout:2000});
              this.router.navigate(['address']);
            }else{
              this.payoutService.clientAddress(this.id, value);
              this.flashMessagesService.show('client successfully Updated', {cssClass:'alert-success', timeout:5000});
              this.router.navigate(['/perfect-turkey']);
            }
            
            break
            
          } else{
            this.flashMessagesService.show('You need to order a DvD', {cssClass:'alert-danger', timeout:5000});
            this.router.navigate(['/perfect-turkey']);
          }
        }
      }
    })



  }

  @HostListener('window:popstate', ['$event'])

    onPopState(e){
      
      if(confirm('Must submit a mailing address')){
        return false
      }else{
        return false
      }

    }
  


}

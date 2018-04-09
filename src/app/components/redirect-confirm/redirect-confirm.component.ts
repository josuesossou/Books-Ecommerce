import { Component, OnInit, HostListener } from '@angular/core';
import { PayoutService } from '../../services/payout.service';
import { Router } from '@angular/router';
import { Charges } from '../../model/interface';
import { log } from 'util';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-redirect-confirm',
  templateUrl: './redirect-confirm.component.html',
  styleUrls: ['./redirect-confirm.component.css']
})
export class RedirectConfirmComponent implements OnInit {
  bool:boolean = true;

  constructor(   
    private payoutService:PayoutService,
    private router:Router,
    public flashMessagesService:FlashMessagesService,
    ) { }

    test:Charges;

  ngOnInit() {
 
      setTimeout( 
        ()=>{
          this.bool = false;
          this.isDisabled();
        },
       5000);

  }

  payementValidation(){

    this.payoutService.auth().subscribe((auth)=>{    

      this.payoutService.checkCharge(auth.uid).subscribe(charges =>{

        if(charges.length == 0){

          this.flashMessagesService.show('Payement canceled', {cssClass:'alert-danger', timeout:5000});
          this.router.navigate(['/perfect-turkey']);

        }else{
         
          for (var i = 0; i < charges.length; i++) {

            this.test = charges[i];

             if (this.test.charge != null && this.test.charge.amount_refunded == 0 && this.test.charge.paid) {

              this.flashMessagesService.show('Payement Successful', {cssClass:'alert-success', timeout:3000});
              this.router.navigate(['video']);
              break
            } 
          }
        }
      });

    });
  }

  isDisabled(){
    return this.bool;
  }

  backhome(){

    this.payoutService.auth().subscribe((auth)=>{    

      this.payoutService.checkCharge(auth.uid).subscribe(charges =>{


        if(charges.length == 0){

          this.flashMessagesService.show('Payement canceled', {cssClass:'alert-danger', timeout:5000});
          this.router.navigate(['']);

        }else{
         
          for (var i = 0; i < charges.length; i++) {

            this.test = charges[i];

             if (this.test.charge != null && this.test.charge.amount_refunded == 0 && this.test.charge.paid) {

              this.flashMessagesService.show('Payement Successful', {cssClass:'alert-success', timeout:3000});
              this.router.navigate(['/perfect-turkey']);
              break
            }

          }
        }
      })

    });

  }
}

import { Component, OnInit } from '@angular/core';
import { PayoutService } from '../../services/payout.service';
import { Videos, Charges } from '../../model/interface';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  paid:boolean;
  userName:string;
  id:string;
  videoUrls:any;
  test:Charges;
  mp4:any;
  webm:any;



  constructor(
    private payoutService:PayoutService,
    private sanitizer:DomSanitizer) { }

  ngOnInit() {

    this.payoutService.auth().subscribe((auth)=>{  
      // this.id = auth.uid;
      this.userName = auth.displayName
    

      this.payoutService.checkCharge(auth.uid).subscribe(charges =>{

        if(charges.length == 0){

          this.paid = false;

        }else{

          this.paid = true;
        
          for (var i = 0; i < charges.length; i++) {

            this.test = charges[i];
            
            if (this.test.charge != null && this.test.charge.amount_refunded == 0 && this.test.charge.paid) {
                        
              this.payoutService.loadVid().subscribe(vids=>{
              
                this.videoUrls = vids;

                let link1 = this.videoUrls[0];
                let link2 = this.videoUrls[1];

                this.mp4 = this.sanitizer.bypassSecurityTrustUrl(link1);
                this.webm = this.sanitizer.bypassSecurityTrustUrl(link2)

              })

              break
            } 
          }
        }
      });

    });

  }


}

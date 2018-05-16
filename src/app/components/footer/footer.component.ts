import { Component, OnInit } from '@angular/core';
import { PayoutService } from '../../services/payout.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  turkeyLink:boolean;

  constructor(
    private payoutService:PayoutService,
    private router:Router
  ) { }

  ngOnInit() {
  }

}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BuyerAuthGuard implements CanActivate{

    constructor(
        private afAuth:AngularFireAuth,
        private router:Router,
    ){  }

   

    canActivate():boolean{
        const user = this.afAuth.auth.currentUser;

        if (!user || user.isAnonymous) {
            this.router.navigate(['/']);
            return false;
        }
        return true;    
    }


}
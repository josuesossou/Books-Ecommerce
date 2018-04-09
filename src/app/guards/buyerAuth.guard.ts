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

   

    canActivate():Observable<boolean>{

        return this.afAuth.authState.map(auth => {
            if(!auth){
                this.router.navigate(['/store']);
                return false
            }else{
                return true;
            }
        })
            
    }


}
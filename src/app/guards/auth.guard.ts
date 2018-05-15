import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate{
    bUser;
    constructor(
        private afAuth:AngularFireAuth,
        private router:Router,
        private route:ActivatedRoute
    ){  

    this.bUser = this.route.snapshot.paramMap.get('bUser');
    }

   

    canActivate():Observable<boolean>{

        const user = this.afAuth.auth.currentUser;

        if (user.isAnonymous) {
            this.router.navigate(['/']);
            return;
        }

        return this.afAuth.authState.map(auth => {
            if(!auth){
                this.router.navigate(['/']);
                return false
            }else if(this.bUser != undefined){
                if(this.bUser !== auth.uid){
                    return false
                }else{
                    return true
                }
            }else {
                return true;
            }
        })
            
    }


}
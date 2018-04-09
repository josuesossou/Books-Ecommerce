import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SellerAuthGuard implements CanActivate{

    bool:string

    constructor(
        private afAuth:AngularFireAuth,
        private router:Router,
        private afdb:AngularFireDatabase
    ){ 
  
    }

   

    canActivate():Observable<boolean>{
        this.afAuth.authState.subscribe(auth => {
            this.bool = auth.uid;
        })

        return this.afdb.list('/registered').valueChanges().map(uids=>{

            if(!uids.includes(this.bool)){
                return false
            }else{
                return true
            }
        });
    }


}
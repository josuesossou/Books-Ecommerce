import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserData } from '../model/interface';

@Injectable()
export class SellerAuthGuard implements CanActivate {

    uid: string;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private afdb: AngularFireDatabase
    ) {}

    canActivate(): Observable<boolean> {
        const user = this.afAuth.auth.currentUser;
        if (!user || user.isAnonymous) {
            this.router.navigate(['/login']);
            return;
        }

        this.uid = user.uid;

        return this.afdb.list('/registered').valueChanges().map((userIds: UserData[]) => {
            const uids = userIds.filter((userId) => userId.uid === this.uid);
            if (uids.length === 0) {
                this.router.navigate(['/login']);
                return false;
            } else {
                return true;
            }
        });
    }
}

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Client, UserData } from '../model/interface';

@Injectable()
export class PayoutService {
  userId: string;
  user;

  constructor(
    private afdb: AngularFireDatabase,
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth && !auth.isAnonymous) {
        this.user = this.afAuth.auth.currentUser;
        this.userId = auth.uid;
      }
    });
  }

   // Saving payement token to the firebase database
  processPayment(token: any, amount: number, description: string, receipt_email: string) {
    const payment = { token , amount, description, receipt_email };
    return this.afdb.list(`/payments/${this.userId}`).push(payment);
  }

  processBookPayment(token: any, amount: number, description: string, receipt_email: string) {
    const payment = { token , amount, description, receipt_email};
    return this.afdb.list(`/bookpayments/${this.userId}`).push(payment);
  }
  /// from buy-book-proccess
  getAllBckPurchases(user) {
    return this.afdb.list(`/bookpayments/${user}`).valueChanges();
  }

  loginWithEmailAndPassword(email: string, password: string, buyer: boolean) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        const user = this.afAuth.auth.currentUser;
        if (buyer && !user.emailVerified) {
          user.delete();
          return;
        }

        if (!buyer && !user.emailVerified) {
          this.afdb.list('/registered').remove(user.uid);
          user.delete();
          return;
        }

        if (buyer) {
          return new Observable();
        }

        return this.afdb.list('/registered').valueChanges();
      }).catch(err => {
        return Promise.reject(err);
      });
  }

  loginAnonymously() {
    return this.afAuth.auth.signInAnonymously();
  }

  deleteAnonymousUser() {
    const user = this.afAuth.auth.currentUser;

    if (!user) {
      return;
    }

    if (user.isAnonymous) {
      return user.delete();
    }
    return;
  }
/************************************ ***********************************/

  // checking authstate
  auth() {
    return this.afAuth.authState.map((auth) => auth);
  }
/************************************ ***********************************/

  checkCharge(uid) {
    return this.afdb.list('/payments/' + uid ).valueChanges();
  }
/************************************ ***********************************/

  // submiting an address on the redirect-address page
  clientAddress(id: String, value: Client) {
    return this.afdb.object(`/address/${id}`).set(JSON.stringify(value));
  }
/************************************ ***********************************/

  loadVid() {
    return this.afdb.list('/vidUrls/').valueChanges();
  }

/************************************ ***********************************/
  logout() {
    if (this.user) {
      return this.afAuth.auth.signOut();
    }
  }

  updateRegister(uid: string, userData: UserData) {
    this.afdb.list('/registered').set(uid, userData);
  }

  resendVerificationEmail(email: string, password: string) {
    return this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password).then(auth => {
      const user = this.afAuth.auth.currentUser;
      return user.sendEmailVerification().then(() => {
        this.logout();
        return Promise.resolve('Email successfully sent');
      }).catch((e) => {
        return Promise.reject(e);
      });
    }).catch(e => {
      return Promise.reject(e);
    });
  }
/************************************ ***********************************/
  // registering users to selling books
  register(email: string, password: string, name: string, userData?: UserData) {
    const db = this;
    return this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(email, password).then((auth) => {
      const user = this.afAuth.auth.currentUser;

      return user.sendEmailVerification().then(() => {
        this.updateProfile(name, userData);
      }).catch((error) => {
        if (!userData) {
          return;
        }
        this.afdb.list('/registered').remove(user.uid);
        user.delete();
      });
    });
  }

  updateProfile(name: string, userData?: UserData) {
    const user = this.afAuth.auth.currentUser;
    userData.uid = user.uid;
    return this.user.updateProfile({displayName: name, photoURL: '' }).then(() => {
      if (!userData) {
        return;
      }
      this.updateRegister(this.user.uid, userData);
    }).catch(err => {
    });
  }
/************************************ ***********************************/
  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email).then(res => {
      return Promise.resolve('Email was successfully sent');
    }).catch(e => {
      return Promise.reject(e);
    });
  }
}


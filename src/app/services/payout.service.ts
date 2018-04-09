import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth, AngularFireAuthProvider } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Client } from '../model/interface';
import { Profile } from 'selenium-webdriver/firefox';


@Injectable()
export class PayoutService {

  userId:string;

  constructor(
    private afdb:AngularFireDatabase,
    private afAuth:AngularFireAuth,
  ) { 
    this.afAuth.authState.subscribe((auth) =>{
      if(auth) this.userId = auth.uid
    });
  }

   //Saving payement token to the firebase database
  processPayment(token:any, amount:number, description:string, receipt_email:string){

    const payment = { token , amount, description, receipt_email}
    return this.afdb.list(`/payments/${this.userId}`).push(payment)
    
  }

  processBookPayment(token:any, amount:number, description:string, receipt_email:string){
    const payment = { token , amount, description, receipt_email}
    return this.afdb.list(`/bookpayments/${this.userId}`).push(payment)
    
  }
  ///from buy-book-proccess
  getAllBckPurchases(user){
    return this.afdb.list(`/bookpayments/${user}`).valueChanges(); 
  }

  ///login
  loginUsingGoogle(){
    return new Promise((resolve, reject)=>{
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())      
        .then(result => resolve(result),
          err => reject(err))
    })
  }

  loginWithEmailAndPassword(email,password){
    let userIds:any[];

    return this.afAuth.auth.signInWithEmailAndPassword(email,password)
      .then(user=>{
        return this.afdb.list('/registered').valueChanges();

      }).catch(err=>{
        return Promise.reject(err);
      });

  }

  loginAnonymously(){
    return this.afAuth.auth.signInAnonymously();
  }

  deleteAnonymousSignUp(authid){
    return this.afAuth.auth.onAuthStateChanged
  }

  //checking authstate
  auth(){
    return this.afAuth.authState.map((auth) => auth);
  }

  checkCharge(uid){
    return this.afdb.list('/payments/'+ uid ).valueChanges()
  }

  //submiting an address on the redirect-address page
  clientAddress(id:String, value:Client){
    return this.afdb.list(`/address/${id}`).push(value)
  }

  loadVid(){
    return this.afdb.list('/vidUrls/').valueChanges()
  }

  logout(){
    return this.afAuth.auth.signOut();
  }

  //registering users to selling books
  register(email:string, password:string, fullName:string){
    return this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(email, password).then(()=>{

      let user = this.afAuth.auth.currentUser;
      return user.updateProfile({displayName:fullName, photoURL:'' }).then(()=>{
        this.afdb.list(`/registered`).push(user.uid)
      })

    })
  }


}


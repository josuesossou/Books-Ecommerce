import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment.prod';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HttpClientModule } from '@angular/common/http';
import { FlashMessagesModule } from 'angular2-flash-messages';

// import firebase modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopContentComponent } from './components/top-content/top-content.component';
import { BooksComponent } from './components/books/books.component';
import { LearnMoreDirective } from './directives/learn-more.directive';
import { BgblueDiagonalDirective } from './directives/bgblue-diagonal.directive';
import { ImgWrapperDirective } from './directives/img-wrapper.directive';
import { BtnWordsWrapperDirective } from './directives/btn-words-wrapper.directive';
import { StartScrollAnimationDirective } from './directives/start-scroll-animation.directive';
import { VideoComponent } from './components/video/video.component';
import { RedirectConfirmComponent } from './components/redirect-confirm/redirect-confirm.component';
import { RedirectAddressComponent } from './components/redirect-address/redirect-address.component';
import { AmazonAffiliateComponent } from './components/amazon-affiliate/amazon-affiliate.component';
import { SellBookComponent } from './components/book-page/sell-book/sell-book.component';
import { BuyBookComponent } from './components/book-page/buy-book/buy-book.component';
import { StoreComponent } from './components/book-page/store/store.component';
import { LoginComponent } from './components/book-page/login/login.component';
import { RegisterComponent } from './components/book-page/register/register.component';
import { SlideshowComponent } from './components/book-page/slideshow/slideshow.component';
import { NavbarComponent } from './components/book-page/navbar/navbar.component';
import { InventoryComponent } from './components/book-page/sell-book/inventory/inventory.component';
import { BooksInStoreComponent } from './components/book-page/sell-book/books-for-sale/books-in-store.component';
import { SoldBooksComponent } from './components/book-page/sell-book/sold-books/sold-books.component';
import { BookPurchasesComponent } from './components/book-page/book-purchases/book-purchases.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { PasswordResetComponent } from './components/book-page/password-reset/password-reset.component';

//services
import { PayoutService } from './services/payout.service';
import { AuthGuard } from './guards/auth.guard';
import { SellerAuthGuard } from './guards/sellerAuth.guard';
import { BuyerAuthGuard } from './guards/buyerAuth.guard';
import { IsbnBooksService } from './services/isbn-books.service';
import { BooksDataService } from './services/books-data.service';
import { BuyBookProccessComponent } from './components/book-page/buy-book-proccess/buy-book-proccess.component';
import { ImgHeightDirective } from './directives/img-height.directive';
import { BuyerLoginComponent } from './components/book-page/buyer-login/buyer-login.component';

const appRoutes:Routes = [
  // {path:'perfect-turkey', component:HomeComponent},
  // {path:'video', component:VideoComponent, canActivate:[AuthGuard]},
  // {path:'confirm', component:RedirectConfirmComponent, canActivate:[AuthGuard]},
  {path:'address/:isbn/:uid', component:RedirectAddressComponent, canActivate:[AuthGuard]},
  {path:'sell-book', component:SellBookComponent, canActivate:[SellerAuthGuard]},
  {path:'book-purchased', component:BookPurchasesComponent, canActivate:[BuyerAuthGuard]},
  {path:'buy-book/:uid/:isbn', component:BuyBookComponent},
  {path:'buy-book-process/:uid/:isbn/:bUser', component:BuyBookProccessComponent, canActivate:[AuthGuard]},
  {path:'', component:StoreComponent},
  {path:'reset-password', component:PasswordResetComponent},
  {path:'buyer-login/:isbn/:uid', component:BuyerLoginComponent},
  {path:'buyer-login', component:BuyerLoginComponent},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'**', component:NotfoundComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    TopContentComponent,
    BooksComponent,
    LearnMoreDirective,
    BgblueDiagonalDirective,
    ImgWrapperDirective,
    BtnWordsWrapperDirective,
    StartScrollAnimationDirective,
    VideoComponent,
    RedirectConfirmComponent,
    RedirectAddressComponent,
    AmazonAffiliateComponent,
    SellBookComponent,
    BuyBookComponent,
    StoreComponent,
    LoginComponent,
    RegisterComponent,
    SlideshowComponent,
    NavbarComponent,
    InventoryComponent,
    BooksInStoreComponent,
    SoldBooksComponent,
    BuyBookProccessComponent,
    NotfoundComponent,
    BookPurchasesComponent,
    ImgHeightDirective,
    PasswordResetComponent,
    BuyerLoginComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'Perfect Turkey'),
    AngularFireAuthModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot(),
    FormsModule,
    CarouselModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    PayoutService,
    AngularFireDatabase,
    AngularFireDatabaseModule,
    AuthGuard,
    IsbnBooksService,
    BooksDataService,
    SellerAuthGuard,
    BuyerAuthGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

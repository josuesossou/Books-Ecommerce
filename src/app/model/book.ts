export interface Book {
    authors?:any[],
    date_published?:string,
    image?:string,
    isbn?:string,
    isbn13?:string,
    overview?:string,
    title?:string,
    title_long?:string,
    price?:number,
    isForSale?:boolean,
    changePrice?:boolean,
    seller?:string,
    email?:string,
    uid?:string,
    sold?:boolean,
    time?:number,
    boughtTime?:number,
    buyerName?:string,
    buyerUid?:string
}

export interface Querry {
    total?:string,
    books?:Book[],
}
interface UserNameDetail {
    displayName?:string,
    uid?:string,
    email?:string
}

export interface User {
    user?:UserNameDetail,
}
export interface Payment {
    description?:string
}

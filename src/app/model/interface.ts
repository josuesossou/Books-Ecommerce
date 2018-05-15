interface Charge{
    amount_refunded?:number;
    paid?:boolean;
}
interface Token{
    used?:boolean;
}

export interface Charges {
    amount?:number;
    charge?:Charge;
    token?:Token;
}

export interface Client {
    fullname?:string;
    addLine1?:string;
    addLine2?:string;
    city?:string;
    state?:string;
    zip?:string;
    country?:string;
}

export interface Videos {
    mp4?:string;
    webm?:string;
}

export interface UserData {
    fullName?:string;
    email?:string;
    business?:string;
    gmailAccount?:string;
    uid?:string;
}

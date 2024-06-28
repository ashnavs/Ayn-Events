export interface IVendor{
    name: string;
    email: string;
    city: string;
    eventname: string;
    password: string;
    logo: string;
    coverpicture: string;
    about: string;
    //review here
    vendorType: string;
    is_verified: boolean;
    verify_request: boolean;
    total_bookings: number;
    otp_verified:boolean
  }
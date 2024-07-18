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
    service: string;
    is_verified: boolean;
    is_blocked: boolean;
    total_bookings: number;
    otp_verified:boolean
  }

  
export interface PaginatedVendors {
  vendors: IVendor[];
  totalPages: number;
}
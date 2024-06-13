import session from 'express-session';




// declare module 'express-session' {
//     interface SessionData {
//       otp?: string;
//       otpGeneratedAt?: number;
//     }
//   }
  
//   // Extend express Request interface to include the extended session properties
//   declare module 'express' {
//     interface Request {
//       session: session.Session & Partial<session.SessionData>;
//     }
//   }



declare module 'express-session' {
    interface SessionData {
       
        otp?: string;
        otpGeneratedAt?: number;
        email: string;
    }
  }


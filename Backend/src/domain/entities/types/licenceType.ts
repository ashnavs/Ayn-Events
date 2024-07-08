// export interface LicenseDataRequest {
//   licenseNumber: string;
//   email: string;
//   issueDate: string;
//   expiryDate: string;
//   licenseDocument: Express.Multer.File;

// }

// export interface LicenseDataResponse {
//   licenseNumber: string;
//   email: string;
//   issueDate: string;
//   expiryDate: string; 
//   licenseDocumentUrl: string;

// }
export interface LicenseDataRequest {
  licenseNumber: string;
  email: string;
  issueDate: string;
  expiryDate: string;
  licenseDocument: Express.Multer.File;
  logo: Express.Multer.File; // New logo field
}

export interface LicenseDataResponse {
  licenseNumber: string;
  email: string;
  issueDate: string;
  expiryDate: string;
  licenseDocumentUrl: string;
  logoUrl: string; // New logo URL field
}


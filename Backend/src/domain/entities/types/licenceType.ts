
export interface LicenseDataRequest {
  licenseNumber: string;
  email: string;
  issueDate: string;
  expiryDate: string;
  licenseDocument: Express.Multer.File;
  logo: Express.Multer.File; 
}

export interface LicenseDataResponse {
  licenseNumber: string;
  email: string;
  issueDate: string;
  expiryDate: string;
  licenseDocumentUrl: string;
  logoUrl: string;
}


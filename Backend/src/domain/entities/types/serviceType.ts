export interface IService {
  _id: string;
  name: string;
  imageUrl:Express.Multer.File;
  createdAt: Date;
  is_active:boolean
}




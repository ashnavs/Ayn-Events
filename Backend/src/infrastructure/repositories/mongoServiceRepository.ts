import { Service } from "../database/dbmodel/serviceModel";

export const getServiceImages = async (serviceNames: string[]) => {
    try {
      return await Service.find({ name: { $in: serviceNames } }, { name: 1, imageUrl: 1 }).lean();
    } catch (error) {
      console.error('Failed to fetch service images', error);
      throw error;
    }
  };
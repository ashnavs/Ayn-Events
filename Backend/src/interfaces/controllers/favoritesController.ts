import { NextFunction, Request, Response } from "express";
import { Favorite } from "../../infrastructure/database/dbmodel/favoritesModel";
import { Vendor } from "../../infrastructure/database/dbmodel/vendorModel";

export default {
    addToFavorites: async (req: Request, res: Response) => {
        const { userId, vendorId, isFavorite } = req.body;


        const actualUserId = userId.id;

        console.log('Request body:', req.body);
        console.log('Actual userId:', actualUserId);

        try {
            let favorite = await Favorite.findOne({ userId: actualUserId, vendorId });
            console.log('Found favorite:', favorite);

            if (favorite) {
                if (isFavorite) {
                    favorite.isFavorite = true;
                    await favorite.save();
                    console.log('Updated favorite:', favorite);
                } else {
                    await Favorite.deleteOne({ userId: actualUserId, vendorId });
                    console.log('Removed favorite from DB');
                }
            } else if (isFavorite) {
                favorite = new Favorite({ userId: actualUserId, vendorId, isFavorite: true });
                await favorite.save();
                console.log('Created new favorite:', favorite);
            }

            res.status(200).json({ message: 'Favorite status updated successfully' });
        } catch (error) {
            console.error('Error updating favorite status:', error);
            res.status(500).json({ error: 'Error updating favorite status' });
        }
    },
    getFavoriteStatus: async (req: Request, res: Response) => {
        const { userId, vendorId } = req.query;
    
        try {
          const favorite = await Favorite.findOne({ userId, vendorId });
          res.status(200).json({ isFavorite: favorite ? favorite.isFavorite : false });
        } catch (error) {
          console.error('Error fetching favorite status:', error);
          res.status(500).json({ error: 'Error fetching favorite status' });
        }
      },

      getFavorites:async (req: Request, res: Response) => {
        const { userId } = req.params;
        console.log('Fetching favorites for user:', userId);
      
        try {
          const favorites = await Favorite.find({ userId: userId, isFavorite: true })
            .populate('vendorId') 
            .exec();

            console.log("favorites:",favorites)
      

          if (!favorites.length) {
            return res.status(404).json({ message: 'No favorites found' });
          }
      

          res.status(200).json(favorites);
        } catch (error) {
          console.error('Error fetching favorites:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      },
    
}

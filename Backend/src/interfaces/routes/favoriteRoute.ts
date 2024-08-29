import { Router } from 'express';
import favoritesController from '../controllers/favoritesController';


const favoriteRouter = Router();

favoriteRouter.post('/addtofavorites',favoritesController.addToFavorites)
favoriteRouter.get('/status', favoritesController.getFavoriteStatus);




export default favoriteRouter;

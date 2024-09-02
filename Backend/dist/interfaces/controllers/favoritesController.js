"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const favoritesModel_1 = require("../../infrastructure/database/dbmodel/favoritesModel");
exports.default = {
    addToFavorites: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, vendorId, isFavorite } = req.body;
        const actualUserId = userId.id;
        console.log('Request body:', req.body);
        console.log('Actual userId:', actualUserId);
        try {
            let favorite = yield favoritesModel_1.Favorite.findOne({ userId: actualUserId, vendorId });
            console.log('Found favorite:', favorite);
            if (favorite) {
                if (isFavorite) {
                    favorite.isFavorite = true;
                    yield favorite.save();
                    console.log('Updated favorite:', favorite);
                }
                else {
                    yield favoritesModel_1.Favorite.deleteOne({ userId: actualUserId, vendorId });
                    console.log('Removed favorite from DB');
                }
            }
            else if (isFavorite) {
                favorite = new favoritesModel_1.Favorite({ userId: actualUserId, vendorId, isFavorite: true });
                yield favorite.save();
                console.log('Created new favorite:', favorite);
            }
            res.status(200).json({ message: 'Favorite status updated successfully' });
        }
        catch (error) {
            console.error('Error updating favorite status:', error);
            res.status(500).json({ error: 'Error updating favorite status' });
        }
    }),
    getFavoriteStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, vendorId } = req.query;
        try {
            const favorite = yield favoritesModel_1.Favorite.findOne({ userId, vendorId });
            res.status(200).json({ isFavorite: favorite ? favorite.isFavorite : false });
        }
        catch (error) {
            console.error('Error fetching favorite status:', error);
            res.status(500).json({ error: 'Error fetching favorite status' });
        }
    }),
    getFavorites: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        console.log('Fetching favorites for user:', userId);
        try {
            const favorites = yield favoritesModel_1.Favorite.find({ userId: userId, isFavorite: true })
                .populate('vendorId')
                .exec();
            console.log("favorites:", favorites);
            if (!favorites.length) {
                return res.status(404).json({ message: 'No favorites found' });
            }
            res.status(200).json(favorites);
        }
        catch (error) {
            console.error('Error fetching favorites:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
};

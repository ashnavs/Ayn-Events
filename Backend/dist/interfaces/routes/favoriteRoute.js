"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoritesController_1 = __importDefault(require("../controllers/favoritesController"));
const favoriteRouter = (0, express_1.Router)();
favoriteRouter.post('/addtofavorites', favoritesController_1.default.addToFavorites);
favoriteRouter.get('/status', favoritesController_1.default.getFavoriteStatus);
exports.default = favoriteRouter;

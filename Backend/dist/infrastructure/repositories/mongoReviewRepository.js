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
exports.getReviewsAndRatings = exports.createReview = void 0;
const reviewModel_1 = require("../database/dbmodel/reviewModel");
const ratingModel_1 = require("../database/dbmodel/ratingModel");
const createReview = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendorId, userId, review, rating } = reviewData;
        const reviews = new reviewModel_1.Review({
            vendorId,
            userId,
            review
        });
        yield reviews.save();
        const ratings = new ratingModel_1.Rating({
            vendorId,
            userId,
            rating
        });
        yield ratings.save();
        return { review: reviews, rating: ratings };
    }
    catch (error) {
        throw new Error(`Failed to report vendor: ${error.message}`);
    }
});
exports.createReview = createReview;
const getReviewsAndRatings = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewModel_1.Review.find({ vendorId }).populate('userId', 'name email');
        const ratings = yield ratingModel_1.Rating.find({ vendorId });
        const combined = reviews.map(review => {
            const userRating = ratings.find(rating => rating.userId.toString() === review.userId._id.toString());
            return Object.assign(Object.assign({}, review.toObject()), { rating: userRating ? userRating.rating : null, userName: review.userId.name });
        });
        return combined;
    }
    catch (error) {
        throw new Error(`Failed to get reviews and ratings for vendor: ${error.message}`);
    }
});
exports.getReviewsAndRatings = getReviewsAndRatings;

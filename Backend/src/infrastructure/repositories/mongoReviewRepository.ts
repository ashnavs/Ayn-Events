import { Review,IReview } from "../database/dbmodel/reviewModel";
import { Rating } from "../database/dbmodel/ratingModel";
import { log } from "console";

export const createReview = async(reviewData:{vendorId:string,userId:string,review:string,rating:number}) => {
    try {
        const {vendorId,userId,review,rating} = reviewData
        const reviews = new Review({
            vendorId,
            userId,
            review
        })

        await reviews.save()

        const ratings = new Rating({
            vendorId,
            userId,
            rating
        })
        
        await ratings.save()

        return {review:reviews, rating:ratings}
    } catch (error:any) {
        throw new Error(`Failed to report vendor: ${error.message}`)
    }
};

// export const getReviewsAndRatings = async (vendorId: string) => {
//     try {
//         const reviews = await Review.find({ vendorId }).populate('vendorId');
//         const ratings = await Rating.find({ vendorId });

//         const combined = reviews.map(review => {
//             const userRating = ratings.find(rating => rating.userId.toString() === review.userId.toString());
//             return {
//                 ...review.toObject(),
//                 rating: userRating ? userRating.rating : null
//             };
//         });

//         return combined;
//     } catch (error: any) {
//         throw new Error(`Failed to get reviews and ratings for vendor: ${error.message}`);
//     }
// };

// export const getReviewsAndRatings = async (vendorId: string) => {
//     try {
//         const reviews = await Review.find({ vendorId }).populate('userId');

//         const ratings = await Rating.find({ vendorId });

//         // Combine reviews and ratings based on userId
//         const combined = reviews.map(review => {
//             const userRating = ratings.find(rating => rating.userId.toString() === review.userId.toString());
//             return {
//                 ...review.toObject(),
//                 rating: userRating ? userRating.rating : null,
//                 userName: (review.userId as any).name // Assuming 'name' exists on the populated user document
//             };
//         });

//         console.log(combined,'combined');
        

//         return combined;
//     } catch (error: any) {
//         throw new Error(`Failed to get reviews and ratings for vendor: ${error.message}`);
//     }
// };

export const getReviewsAndRatings = async (vendorId: string) => {
    try {
        const reviews = await Review.find({ vendorId }).populate('userId', 'name email');
        const ratings = await Rating.find({ vendorId });

        // Combine reviews and ratings based on userId
        const combined = reviews.map(review => {
            const userRating = ratings.find(rating => rating.userId.toString() === review.userId._id.toString());
            return {
                ...review.toObject(),
                rating: userRating ? userRating.rating : null,
                userName: review.userId.name  // Access userName directly
            };
        });

        return combined;
    } catch (error: any) {
        throw new Error(`Failed to get reviews and ratings for vendor: ${error.message}`);
    }
};
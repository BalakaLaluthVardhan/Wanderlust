const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Validation Middleware
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};

// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// DELETE REVIEW
router.delete(
    "/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewController.destroyReview)
);

// EDIT REVIEW FORM
router.get(
    "/:reviewId/edit",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewController.renderEditReviewForm)
);

// UPDATE REVIEW
router.put(
    "/:reviewId",
    isLoggedIn,
    isAuthor,
    validateReview,
    wrapAsync(reviewController.updateReview)
);

module.exports = router;
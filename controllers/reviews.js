const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

// CREATE REVIEW
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
};

// DELETE REVIEW
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};

// EDIT REVIEW FORM
module.exports.renderEditReviewForm = async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findById(id);
    let review = await Review.findById(reviewId);
    if (!listing || !review) {
        throw new ExpressError(404, "Not Found");
    }
    res.render("reviews/edit.ejs", { listing, review });
};

// UPDATE REVIEW
module.exports.updateReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let review = await Review.findByIdAndUpdate(reviewId, { ...req.body.review }, { new: true, runValidators: true });
    if (!review) {
        throw new ExpressError(404, "Review Not Found");
    }
    req.flash("success", "Review Updated");
    res.redirect(`/listings/${id}`);
};
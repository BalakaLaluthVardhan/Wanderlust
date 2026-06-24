const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const Review = require("../models/review.js");

// Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

// Signup Logic
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

// Login Logic
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back!");

    let redirectUrl = res.locals.redirectUrl || "/listings";

    delete req.session.redirectUrl;

    res.redirect(redirectUrl);
};

// Logout Logic
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are Logged Out");
        res.redirect("/listings");
    });
};

// User Dashboard
module.exports.dashboard = async (req, res) => {
    let listings = await Listing.find({ owner: req.user._id });
    let bookings = await Booking.find({ user: req.user._id }).populate("listing");
    
    // Find all reviews written by this user, and their corresponding listings
    let reviews = await Review.find({ author: req.user._id });
    let listingsWithReviews = await Listing.find({
        reviews: { $in: reviews.map(r => r._id) }
    }).populate("reviews");

    res.render("users/dashboard", { listings, bookings, reviews, listingsWithReviews });
};

// Render Wishlist
module.exports.renderWishlist = async (req, res) => {
    let user = await User.findById(req.user._id).populate("wishlist");
    res.render("users/wishlist", { wishlist: user.wishlist });
};

// Toggle Wishlist Item
module.exports.toggleWishlist = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(req.user._id);
    
    if (!user.wishlist) {
        user.wishlist = [];
    }
    
    let exists = user.wishlist.some(wishlistId => wishlistId.toString() === id.toString());
    
    if (exists) {
        await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: id } });
        req.flash("success", "Removed from Wishlist");
    } else {
        await User.findByIdAndUpdate(req.user._id, { $push: { wishlist: id } });
        req.flash("success", "Added to Wishlist");
    }
    
    res.redirect(req.get("Referer") || "/listings");
};
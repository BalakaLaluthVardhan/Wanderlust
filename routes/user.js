const express = require("express");
const passport = require("passport");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userController = require("../controllers/users.js");

// Signup Routes
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login Routes
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

// Logout Route
router.get(
    "/logout",
    userController.logout
);

// Dashboard Route
router.get(
    "/dashboard",
    isLoggedIn,
    wrapAsync(userController.dashboard)
);

// Wishlist Routes
router.get(
    "/wishlist",
    isLoggedIn,
    wrapAsync(userController.renderWishlist)
);

router.post(
    "/listings/:id/wishlist",
    isLoggedIn,
    wrapAsync(userController.toggleWishlist)
);

module.exports = router;
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

// CREATE Booking
router.post(
    "/listings/:id/bookings",
    isLoggedIn,
    wrapAsync(bookingController.createBooking)
);

// DELETE Booking
router.delete(
    "/bookings/:id",
    isLoggedIn,
    wrapAsync(bookingController.destroyBooking)
);

module.exports = router;

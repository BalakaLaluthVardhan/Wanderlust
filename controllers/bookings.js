const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createBooking = async (req, res) => {
    let { id } = req.params;
    let { checkIn, checkOut } = req.body.booking;

    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
    }

    let inDate = new Date(checkIn);
    let outDate = new Date(checkOut);
    let today = new Date();
    today.setHours(0,0,0,0);

    if (inDate < today) {
        req.flash("error", "Check-in date cannot be in the past");
        return res.redirect(`/listings/${id}`);
    }

    if (inDate >= outDate) {
        req.flash("error", "Check-out date must be after check-in date");
        return res.redirect(`/listings/${id}`);
    }

    // Check for overlapping bookings
    let overlappingBookings = await Booking.find({
        listing: id,
        status: "Confirmed",
        $or: [
            {
                checkIn: { $lte: outDate },
                checkOut: { $gte: inDate }
            }
        ]
    });

    if (overlappingBookings.length > 0) {
        req.flash("error", "These dates are already booked. Please choose other dates.");
        return res.redirect(`/listings/${id}`);
    }

    // Calculate nights and price
    let diffTime = Math.abs(outDate - inDate);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let totalPrice = diffDays * listing.price;

    const newBooking = new Booking({
        listing: id,
        user: req.user._id,
        checkIn: inDate,
        checkOut: outDate,
        totalPrice: totalPrice,
    });

    await newBooking.save();

    req.flash("success", `Booking confirmed for ${diffDays} nights! Total: ₹${totalPrice.toLocaleString("en-IN")}`);
    res.redirect("/dashboard");
};

module.exports.destroyBooking = async (req, res) => {
    let { id } = req.params;
    let booking = await Booking.findById(id);

    if (!booking) {
        throw new ExpressError(404, "Booking Not Found");
    }

    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You do not have permission to cancel this booking.");
        return res.redirect("/dashboard");
    }

    await Booking.findByIdAndDelete(id);

    req.flash("success", "Booking Cancelled");
    res.redirect("/dashboard");
};

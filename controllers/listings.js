const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

// INDEX
module.exports.index = async (req, res) => {
    let filter = {};
    if (req.query.category) {
        filter.category = req.query.category;
    }
    if (req.query.search) {
        let searchRegex = new RegExp(req.query.search, "i");
        filter.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex }
        ];
    }
    let listings = await Listing.find(filter);
    res.render("./listings/index.ejs", { listings, category: req.query.category || "", search: req.query.search || "" });
};

// NEW
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

// SHOW
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
    }

    res.render("./listings/show.ejs", { listing });
};

// CREATE
module.exports.createListing = async (req, res) => {
    if (!req.file) {
        req.flash("error", "Please upload an image");
        return res.redirect("/listings/new");
    }
    let url = req.file.path;
    let filename = req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = { url, filename };

    // Geocode Location
    let searchQuery = `${req.body.listing.location}, ${req.body.listing.country}`;
    let geometry = { type: "Point", coordinates: [77.209, 28.613] }; // Default to New Delhi
    try {
        let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`, {
            headers: { "User-Agent": "WanderlustApp/1.0" }
        });
        let data = await response.json();
        if (data && data.length > 0) {
            geometry = {
                type: "Point",
                coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
            };
        }
    } catch (err) {
        console.error("Geocoding failed, using default coordinates:", err);
    }
    newList.geometry = geometry;

    await newList.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

// EDIT
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
    }

    res.render("./listings/edit.ejs", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
    }

    let locationChanged = req.body.listing.location !== listing.location || req.body.listing.country !== listing.country;
    
    // Update basic fields
    Object.assign(listing, req.body.listing);

    if (locationChanged) {
        let searchQuery = `${listing.location}, ${listing.country}`;
        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`, {
                headers: { "User-Agent": "WanderlustApp/1.0" }
            });
            let data = await response.json();
            if (data && data.length > 0) {
                listing.geometry = {
                    type: "Point",
                    coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
                };
            }
        } catch (err) {
            console.error("Geocoding failed on update:", err);
        }
    }

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        throw new ExpressError(404, "Listing Not Found");
    }

    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

// INDEX
module.exports.index = async (req, res) => {
    let listings = await Listing.find({});
    res.render("./listings/index.ejs", { listings });
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
    let url= req.file.path;
    let filename= req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = {url,filename};
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
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true, runValidators: true }
    );

    if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
    }

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }

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
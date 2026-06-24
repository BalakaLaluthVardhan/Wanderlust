const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description: {
        type: String,
    },
    image:{
        url: String,
        filename: String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic"],
        required: true,
        default: "Trending"
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true,
            default: [77.209, 28.613] // Default to New Delhi coordinates [lon, lat]
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews },
        });
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
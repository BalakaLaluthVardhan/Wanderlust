const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(()=>{
        console.log("Connected to DB")
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    
    const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic"];
    
    console.log("Seeding database and geocoding listings... Please wait.");
    
    const seededListings = [];
    for (let i = 0; i < initData.data.length; i++) {
        let item = initData.data[i];
        let category = categories[i % categories.length];
        
        let searchQuery = `${item.location}, ${item.country}`;
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
                console.log(`Geocoded "${item.title}" to [${geometry.coordinates}]`);
            } else {
                console.log(`Could not geocode "${item.title}", using default`);
            }
        } catch (err) {
            console.log(`Error geocoding "${item.title}":`, err.message);
        }
        
        // Wait 300ms between requests to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 300));
        
        seededListings.push({
            ...item,
            owner: "6a318d0e102bd10c4a0e6fc9",
            category: category,
            geometry: geometry
        });
    }

    await Listing.insertMany(seededListings);
    console.log("Data was successfully initialized with categories and correct map coordinates!");
    process.exit(0);
};

initDB();
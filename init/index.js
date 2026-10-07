const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/vacation";

async function main() {
    await mongoose.connect(mongo_url);
    console.log("✅ Connected to DB");

    await initDB();

    mongoose.connection.close();
}

main().catch((err) => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);

    console.log("✅ Sample data initialized");
};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/vacation";
let port = 8080;
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//npm i ejs-mate [help to create template ex. nav bar footer]
const { nextTick } = require("process");
const res = require("express/lib/response.js");
const wrapAsync = require("./utlis/wrapAsync.js");
const ExpressError = require("./utlis/ExpressError.js");
const { error } = require("console");
const Review = require("./models/review.js");
const { reviewSchema } = require("./models/review.js");
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


main()
    .then(() => {
        console.log("Connected to DB")
    }).catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(`${mongo_url}`);
};
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
};
app.get("/", (req, res) => {
    res.send("Hii i am working fine");
});


//index
app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await listing.find({});
    res.render("listing/index", { allListing });
}));
//new
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listing/new");
}));
//update
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const foundlisting = await listing.findById(id);
    res.render("listing/edit.ejs", { foundlisting });
}));
app.put("/listings/:id", validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));
//show
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const foundlisting = await listing.findById(id);
    res.render("listing/show.ejs", { foundlisting });
}));
//delete
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
}));

//review post route
app.post("/listings/:id/review", async (req, res) => {
    let { id } = req.params;

    let foundListing = await listing.findById(id);

    let newReview = new Review(req.body.review);

    foundListing.reviews.push(newReview);

    await newReview.save();
    await foundListing.save();

    console.log("review saved");
    res.send("new review saved");
});
//create route
app.post("/listings",validateListing,
    wrapAsync(async (req, res, next) => {

        const newlisting = new listing(req.body.listing);
        // if (!newlisting.title) {
        //     throw new ExpressError(404, "title is missing");
        // }
        // if (!newlisting.description) {
        //     throw new ExpressError(404, "Description is missing");
        // }
        //  if (!newlisting.price) {
        //     throw new ExpressError(404, "Price is missing");
        // }
        //  if (!newlisting.country) {
        //     throw new ExpressError(404, "country is missing");
        // }
        //  if (!newlisting.Location) {
        //     throw new ExpressError(404, "location is missing");
        // }
        await newlisting.save();
        res.redirect("/listings");
    }));


// app.get("/testlisting", async (req, res) => {
//     let sample = new listing({
//         title:"my new Villa",
//         description:"near the Beach",
//         price: 12000,
//         location:"goa",
//         country : "india",
//     });
//     await sample.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err })
});

app.listen(port, () => {
    console.log(`server is listening to ${port}`);
});

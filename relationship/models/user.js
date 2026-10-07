const { number } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
main().then(() => console.log("Connection Sucessfull"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDEmo');
}
const userSchema = new Schema({
    username: String,
    addresses: [
        {
            Location: String,
            city: String,
            pin: Number
        },
    ]
});

const User = mongoose.model("user", userSchema);

const addUsers = async () => {
    let user1 = new User({
        username: "Vicky",
        addresses: [{
            Location: "sardar bigha",
            city: "nalanda",
            pin: 800020
        },
        ],
    });
    user1.addresses.push({ Location: "patna", city: "patna", pin: 800016 })

    let result=await user1.save();
    console.log(result);
}

addUsers();
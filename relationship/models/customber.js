const { number } = require("joi");
const mongoose = require("mongoose");
const { log } = require("node:console");
const { Schema } = mongoose;
main().then(() => console.log("Connection Sucessfull"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDEmo');
}
const orderSchema = new Schema({
    item: String,
    Price: Number,
});

const customberSchema = new Schema({
    name: String,
    email: String,
    address: String,
    mobile: Number,
    order: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"
        },
    ]
});
const Customber = mongoose.model("Customber", customberSchema);
const Order = mongoose.model("Order", orderSchema);

const addCustomber = async () => {
    let cust1 = new Customber({
        name: "Vicky Kumar",
        email: "ranjitvicky745@gmail.com",
        address: "Patna, Bihar",
        mobile: 85250369147,

    });
    let order1 = await Order.findOne({ item: "Samosa" });
    let order2 = await Order.findOne({ item: "choclate" });

    cust1.order.push(order1);
    cust1.order.push(order2);

    let result = await cust1.save();
    console.log(result);




};
addCustomber();

const addOrder = async () => {
    let result = await Order.insertMany(
        [{ item: "Samosa", Price: 50 },
        { item: "cold drink", Price: 90 },
        { item: "choclate", Price: 400 },]
    );
    //console.log(result);

}
addOrder();
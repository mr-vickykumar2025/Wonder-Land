
const mongoose = require("mongoose");
const { Schema } = mongoose;
main().then(() => console.log("Connection Sucessfull"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDEmo');
}
const userSchema = new Schema({
    username: String,
    email: String,
});
const postSchema = new Schema({
    content: String,
    likes: Number,
    comments: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
const User = mongoose.model("User", userSchema);
const post = mongoose.model("Post", postSchema);

const addData = async () => {
    // let user1 = new User({
    //     username: "kumar_vicky_ig",
    //     email: "abc@gmail.com",
    // });
    let user= await User.findOne({username:"kumar_vicky_ig"});  //fetching by database
    let post1 = new post({
        content: "hello",
        likes: 70,
        comments: 2,
    });
    post1.user = user;
    let post2 = new post({
        content: "img.jpg",
        likes: 20,
        comments: 3,
    });
    post2.user = user;

    //await user1.save();
    await post2.save();
};
addData();

// const getData = async()=>{
//     let result = await post.findOne({}).populate("user");
//     console.log(result);
// }; // this function give full detail of user insted of only id
// getData(); 
const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        content: { type: String },
        owner: { type: mongoose.SchemaTypes.ObjectId, ref:"User"},
        file: { type: String },

    },{timestamps:true}
);

const PostModel = mongoose.model("Posts", postSchema);

module.exports = PostModel

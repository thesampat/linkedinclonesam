const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        content: { type: String },
        author: { type: mongoose.SchemaTypes.ObjectId, ref:"User", required:true},
        file: { type: String },

    },{timestamps:true}
);

const PostModel = mongoose.model("Posts", postSchema);

module.exports = PostModel

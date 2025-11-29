const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");

const client = new S3({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET,
    },
});

const uploadS3File = async (file) => {
    try {
        const params = {
            Bucket: "amzn-sam",
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ContentDisposition: "inline",
        };

        await client.send(new PutObjectCommand(params));

        const url = `https://dqfebx74t6qdi.cloudfront.net/${file.originalname}`;
        return url;

    } catch (err) {
        console.log("Error uploading file:", err);
        throw new Error("Error uploading");
    }
};

module.exports = { uploadS3File };

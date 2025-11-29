const AWS = require("@aws-sdk/client-s3");


const client = new AWS.S3({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET,
    },
});

const uploadS3File = async (file) => {
    console.log(file)
    client.putObject({
        Bucket: 'amzn-sam',
        Key: file?.originalname,
        Body: file?.buffer,
        ContentType: file?.mimetype,
        ContentDisposition: 'inline'
    }, (err, data) => {
        if (err) {
            console.log('Error uploading file:', err);
            throw Error('error uplaodign')
        } else {
            let url = `https://amzn-sam.s3.eu-north-1.amazonaws.com/${file?.originalname}`
            console.log(url, data)
            return url
        }
    })
}

module.exports = { uploadS3File };
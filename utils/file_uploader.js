const path = require("path");
const fs = require("fs");
const AWS = require("aws-sdk");
const mime = require("mime-types");
const { v4 : uuidv4 }= require("uuid")

const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_ACCESS_KEY,
  secretAccessKey: process.env.SPACES_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

exports.uploadDigital = async (filePath) => {
    try {
      // Determine the file name and extension
      const fileName = path.basename(filePath);
      const date=new Date()
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const timeString =  uuidv4()+`${hours}-${minutes}-${seconds}`;
      
      
     
      // Determine the file extension using mime-types
      const fileExt = mime.extension(mime.lookup(fileName)) || 'mp4';
  
      // Construct the file key (file name) with the correct file extension
      const fileKey = `${timeString}.${fileExt}`;
  
      // Read the file content
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (err) => {
        console.log('File Error', err);
      });

      
      // Determine the content type
      const contentType = mime.lookup(fileKey) || 'application/octet-stream';
  
      // Upload file to S3
      const params = {
        Bucket: 'master',
        Key: `${process.env.MASTER_BUCKET}/${fileKey}`,
        Body: fileStream,
        ACL: 'public-read',
        ContentType: contentType,
      };
      
      const uploadResponse = await s3.upload(params).promise();
    
      const publicUrl = `https://${process.env.SPACE_CDN_ENDPOINT}/${process.env.MASTER_BUCKET}/${fileKey}`;

      return {publicUrl}
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };
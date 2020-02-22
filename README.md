# Minimal PreSigned URL via the NodeJS AWS SDK

This demo is to accompany the blog post [here](https://abstractmechanics.co.uk/posting-to-aws-presigned-urls)

The purpose is to document the use of presigned URLs, and to delve a little deeper into the "gubbins".

## To Run

`npm install`

`AWS_REGION=eu-west-2 AWS_BUCKET=your.bucket npm start`

## Environment Variables

|    Name    | Example Value |                         Explanation                         |
| ---------- | ------------- | ----------------------------------------------------------- |
| AWS_BUCKET | my.s3.bucket  | The bucket to use for the creation of the presigned url     |
| AWS_REGION | eu-west-2     | The region to use for uploads and presigned url calculation |
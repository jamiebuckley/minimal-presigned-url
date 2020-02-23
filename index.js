const url = require('url')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({apiVersion: '2006-03-01', region: process.env['AWS_REGION']})

const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use('/public', express.static('public'));
const port = 3000

/**
 * Given the data returned from the AWS presigned post request
 * Turn into view data model
 * See https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createPresignedPost-property
 */
const createViewData = (data, successUrl) => ({
    // this is the form action route.  Won't let you post anywhere else
    url: data.url,

    // this is the key the form is allowed to upload to
    key: data.fields.key,

    // the signing algorithm used when calculating the signature of the upload request
    algorithm: data.fields['X-Amz-Algorithm'],

    // the Access Key ID used to create the request, along with the region and date of the credential
    credential: data.fields['X-Amz-Credential'],

    // The date this request was made at, must match the credential date
    date: data.fields['X-Amz-Date'],

    // The signature of the presigned post policy, signed with the info in the credential and the secret access key
    signature: data.fields['X-Amz-Signature'],

    // Where the upload will redirect to on success
    success_action_redirect: successUrl,

    // The base64 calculation of all of the above, which combines to say "what is allowed to be uploaded"
    policy: data.fields['Policy']
});

/**
 * Handle the request to /
 */
const handleIndex = (req, res) => {
    const successUrl = url.format({ protocol: req.protocol, host: req.get('host'), pathname: 'upload_success' });

    // make a request for a presigned post to a predetermined bucket 
    // with a predetermined key with a predetermined redirect
    // you also can't post more things from the form unless they are specified here in the
    // Fields or Conditions section
    s3.createPresignedPost({
        Bucket: process.env['AWS_BUCKET'],
        Fields: { 
            key: 'GeneratedFile' + Date.now(),
            "success_action_redirect": successUrl
        }
    }, 
    // who needs promises when you have callbacks eh...
    (err, data) => {
        if (err) {
            console.error(err);
            res.render('error');
        } else {
            console.log(data);
            res.render('index', createViewData(data, successUrl));
        }
    });
};

app.get('/', (req, res) => handleIndex(req, res))
app.get('/upload_success', (req, res) => res.render('success'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
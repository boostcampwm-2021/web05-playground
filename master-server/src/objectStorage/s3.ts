import AWS from 'aws-sdk';

const endpoint = new AWS.Endpoint(process.env.ENDPOINT!);
const region = process.env.AWS_REGION;
const accessKey = process.env.AWS_ACCESS_KEY!;
const secretKey = process.env.AWS_SECRET_KEY!;

export const bucketName = 'playground';

AWS.config.update({
    region,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    },
});

export const S3 = new AWS.S3({
    endpoint: endpoint.href,
    signatureVersion: 'v4',
});

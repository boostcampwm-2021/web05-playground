import { IResolvers } from 'graphql-tools';
import { bucketName, S3 } from '../../objectStorage/s3';

const fileResolver: IResolvers = {
    Mutation: {
        async getUploadUrl(
            _: void,
            args: { fileUrl: string },
        ): Promise<string> {
            const signedUrl = S3.getSignedUrl('putObject', {
                Bucket: bucketName,
                Key: args.fileUrl,
                Expires: 300,
                ACL: 'public-read',
            });

            return signedUrl;
        },
    },
};

export default fileResolver;

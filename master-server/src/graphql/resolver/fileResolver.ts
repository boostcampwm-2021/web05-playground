import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

import { finished } from 'stream/promises';
import { IResolvers } from '@graphql-tools/utils';
interface IFile {
    file: FileUpload;
    wid: number;
    bid: number;
    oid: number;
}

export const fileResolver: IResolvers = {
    Upload: GraphQLUpload,
    Mutation: {
        async uploadFile(_: void, fileInfo: IFile): Promise<string> {
            const { file, wid, bid, oid } = fileInfo;
            const { createReadStream, filename, mimetype, encoding } = file;
            console.log(fileInfo);
            console.log(file, wid, bid, oid);
            const stream = createReadStream();
            const out = createWriteStream('local-file-output.txt');
            stream.pipe(out);
            await finished(out);

            const url = '';
            return url;
        },
    },
};

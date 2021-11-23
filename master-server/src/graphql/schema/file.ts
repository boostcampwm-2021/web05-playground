import { gql } from 'apollo-server-express';

const fileTypeDef = gql`
    scalar Upload

    input IFile {
        file: Upload!
        wid: Int!
        bid: Int!
        oid: Int!
    }
`;

export default fileTypeDef;

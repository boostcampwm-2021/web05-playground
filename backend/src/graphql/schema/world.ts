import { gql } from 'apollo-server-express';

const worldTypeDef = gql`
    type IWorld {
        id: Int!
        uid: Int
        name: String!
        port: Int!
        thumbnail: String!
    }
`;

export default worldTypeDef;

import { gql } from 'apollo-server-express';

const userTypeDef = gql`
    type IUser {
        id: Int!
        email: String
        nickname: String!
        imageUrl: String!
    }
`;

export default userTypeDef;

import { gql } from 'apollo-server-express';

const objectTypeDef = gql`
    type IObject {
        id: Int
        url: String
    }
`;

export default objectTypeDef;

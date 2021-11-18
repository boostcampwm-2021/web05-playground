import { gql } from 'apollo-server-express';

const characterTypeDef = gql`
    type ICharacter {
        id: Int
        imageUrl: String
    }
`;

export default characterTypeDef;

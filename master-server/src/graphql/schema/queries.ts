import { gql } from 'apollo-server-express';

const queryTypeDefs = gql`
    type Query {
        worldList: [IWorld!]!
        characterList: [ICharacter]!
        buildingUrl: [IBuilding]!
        objectUrl: [IObject]!
    }
    type Mutation {
        setUserInfo(id: Int, nickname: String, imageUrl: String): IUser!
        user(code: String): IUser!
        getUploadUrl(fileUrl: String): String!
    }
`;

export default queryTypeDefs;

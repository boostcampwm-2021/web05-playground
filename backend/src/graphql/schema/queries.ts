import { gql } from 'apollo-server-express';

const queryTypeDefs = gql`
    type Query {
        worldList: [IWorld!]!
        characterList: [ICharacter]!
        buildingUrl: [IBuilding]!
    }
    type Mutation {
        setUserInfo(id: Int, nickname: String, imageUrl: String): IUser!
    }
`;

export default queryTypeDefs;

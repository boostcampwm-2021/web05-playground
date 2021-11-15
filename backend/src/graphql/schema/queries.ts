import { gql } from 'apollo-server-express';

const queryTypeDefs = gql`
    type Query {
        worldList: [IWorld!]!
        buildingUrl: [IBuilding]!
        objectUrl: [IObject]!
    }
`;

export default queryTypeDefs;

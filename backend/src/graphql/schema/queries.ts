import { gql } from 'apollo-server-express';

const queryTypeDefs = gql`
    type Query {
        worldList: [IWorld!]!
        buildingList: [IBuilding]!
    }
`;

export default queryTypeDefs;

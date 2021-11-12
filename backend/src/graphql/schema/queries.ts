import { gql } from 'apollo-server-express';

const queryTypeDefs = gql`
    type Query {
        worldList: [IWorld!]!
        buildingUrl: [IBuilding]!
    }
`;

export default queryTypeDefs;

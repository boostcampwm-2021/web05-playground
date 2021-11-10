import { gql } from 'apollo-server-express';

const buildingTypeDef = gql`
    type IBuilding {
        id: Int
        x: Int
        y: Int
        uid: Int
        description: String
        scope: String
        password: String
        url: String
    }
`;

export default buildingTypeDef;

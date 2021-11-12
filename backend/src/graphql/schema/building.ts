import { gql } from 'apollo-server-express';

const buildingTypeDef = gql`
    type IBuilding {
        id: Int
        url: String
    }
`;

export default buildingTypeDef;

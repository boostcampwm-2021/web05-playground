import { gql } from '@apollo/client';

export const getWorldList = gql`
    query Query {
        worldList {
            id
            uid
            name
            port
            thumbnail
        }
    }
`;

export const getBuildingList = gql`
    query Query {
        buildingList {
            x
            y
            url
        }
    }
`;

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

export const getBuildingUrl = gql`
    query Query {
        buildingUrl {
            id
            url
        }
    }
`;

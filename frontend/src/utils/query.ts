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

export const getCharacterList = gql`
    query Query {
        characterList {
            id
            imageUrl
        }
    }
`;

export const setUserInfo = gql`
    mutation Mutation($setUserInfoId: Int, $nickname: String, $imageUrl: String) {
        setUserInfo(id: $setUserInfoId, nickname: $nickname, imageUrl: $imageUrl) {
            id
            email
            nickname
            imageUrl
        }
    }
`;

export const getBuildingAndObjectUrls = gql`
    query Query {
        buildingUrl {
            id
            url
        }
        objectUrl {
            id
            url
        }
    }
`;

export const getUploadUrl = gql`
    getUploadUrl(fileUrl: String): String!
`;

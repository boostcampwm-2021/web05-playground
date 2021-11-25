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
    mutation Mutation($id: Int, $nickname: String, $imageUrl: String) {
        setUserInfo(id: $id, nickname: $nickname, imageUrl: $imageUrl) {
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

export const getAccessToken = gql`
    mutation Mutation($code: String) {
        user(code: $code) {
            id
            email
            nickname
            imageUrl
        }
    }
`;

export const getUploadUrl = gql`
    mutation Mutation($fileUrl: String) {
        getUploadUrl(fileUrl: $fileUrl)
    }
`;

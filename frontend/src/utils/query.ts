import { gql } from '@apollo/client';

// cache-and-network
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

// cache-first
export const getCharacterList = gql`
    query Query {
        characterList {
            id
            imageUrl
        }
    }
`;

// cache-first
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

// update를 이용하면, 기존 데이터 캐싱적용
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

export const fetchCreateWorld = gql`
    mutation Mutation($uid: Int, $name: String) {
        createWorld(uid: $uid, name: $name)
    }
`;

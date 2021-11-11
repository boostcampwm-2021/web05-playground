import { IResolvers } from 'graphql-tools';

const dummy: any[] = [
    {
        id: 1,
        x: 3,
        y: 3,
        uid: 1,
        description: '테스트1',
        scope: 'private',
        password: '1234',
        url: 'http://localhost:3000/assets/home.png',
    },
    {
        id: 2,
        x: 10,
        y: 10,
        uid: 4,
        description: '테스트2',
        scope: 'public',
        password: '',
        url: 'http://localhost:3000/assets/home.png',
    },
];

const buildingResolver: IResolvers = {
    Query: {
        buildingList: () => {
            return dummy;
        },
    },
};

export default buildingResolver;

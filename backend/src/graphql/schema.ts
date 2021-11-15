import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import worldResolver from './resolver/worldResolver';
import buildingResolver from './resolver/buildingResolver';

import queryTypeDefs from './schema/queries';
import worldTypeDef from './schema/world';
import buildingTypeDef from './schema/building';
import characterTypeDef from './schema/character';
import characterResolver from './resolver/characterResolver';
import userResolver from './resolver/userResolver';
import userTypeDef from './schema/user';

const typeDefs = [
    queryTypeDefs,
    userTypeDef,
    worldTypeDef,
    buildingTypeDef,
    characterTypeDef,
];
const resolvers = [
    worldResolver,
    buildingResolver,
    characterResolver,
    userResolver,
];

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;

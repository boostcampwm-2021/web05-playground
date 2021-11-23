import 'graphql-import-node';

import { makeExecutableSchema } from 'graphql-tools';

import worldResolver from './resolver/worldResolver';
import buildingResolver from './resolver/buildingResolver';
import objectResolver from './resolver/objectResolver';

import queryTypeDefs from './schema/queries';
import worldTypeDef from './schema/world';
import buildingTypeDef from './schema/building';
import characterTypeDef from './schema/character';
import characterResolver from './resolver/characterResolver';
import userResolver from './resolver/userResolver';
import userTypeDef from './schema/user';
import objectTypeDef from './schema/object';
import { fileResolver } from './resolver/fileResolver';
import { GraphQLSchema } from 'graphql';

const typeDefs = [
    queryTypeDefs,
    userTypeDef,
    worldTypeDef,
    buildingTypeDef,
    characterTypeDef,
    objectTypeDef,
];

const resolvers = [
    worldResolver,
    buildingResolver,
    characterResolver,
    userResolver,
    objectResolver,
    fileResolver,
];

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;

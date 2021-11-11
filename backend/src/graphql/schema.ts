import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import worldResolver from './resolver/worldResolver';
import buildingResolver from './resolver/buildingResolver';

import queryTypeDefs from './schema/queries';
import worldTypeDef from './schema/world';
import buildingTypeDef from './schema/building';

const typeDefs = [queryTypeDefs, worldTypeDef, buildingTypeDef];
const resolvers = [worldResolver, buildingResolver];

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;

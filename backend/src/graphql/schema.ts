import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import worldResolver from './resolver/worldResolver';
import buildingResolver from './resolver/buildingResolver';
import objectResolver from './resolver/objectResolver';

import queryTypeDefs from './schema/queries';
import worldTypeDef from './schema/world';
import buildingTypeDef from './schema/building';
import objectTypeDef from './schema/object';

const typeDefs = [queryTypeDefs, worldTypeDef, buildingTypeDef, objectTypeDef];
const resolvers = [worldResolver, buildingResolver, objectResolver];

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;

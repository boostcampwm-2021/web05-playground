import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import * as worldTypes from './schema/world.graphql';
import * as objectTypes from './schema/object.graphql';

import worldResolver from './resolver/worldResolver';
import objectResolver from './resolver/objectResolver';
import { type } from 'os';

//const typeDefs = { world: worldTypes, object: objectTypes };
const typeDefs = worldTypes;
const resolvers = [worldResolver, objectResolver];

const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

export default schema;

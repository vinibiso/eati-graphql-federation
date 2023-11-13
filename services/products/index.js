const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/federation");
const products = require("./products.json");

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int = 5): [Product]
  }

  type Product @key(fields: "id") {
    id: String!
    name: String
    price: Int
    weight: Int
  }
`;

const resolvers = {
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    },
  },
  Product: {
    __resolveReference(object) {
      return products.find((product) => product.id === object.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

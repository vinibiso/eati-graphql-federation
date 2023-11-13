const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/federation");
const inventory = require("./inventory.json");

const typeDefs = gql`
  extend type Product @key(fields: "id") {
    id: String! @external
    price: Int @external
    weight: Int @external
    inStock: Boolean
    shippingEstimate: Int @requires(fields: "price weight")
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return {
        ...object,
        ...inventory.find((inventory) => inventory.id === object.id),
      };
    },
    shippingEstimate(product) {
      if (product.price > 1000) {
        return 0;
      }
      return product.weight * 0.5;
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

server.listen(4003).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

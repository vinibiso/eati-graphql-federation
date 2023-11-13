const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/federation");
const reviews = require("./reviews.json");

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
    body: String
    author: User
    product: Product
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
  }

  extend type Product @key(fields: "id") {
    id: String! @external
    reviews: [Review]
  }
`;

const resolvers = {
  Product: {
    reviews(product) {
      return reviews.filter((review) => review.productID === product.id);
    },
    numberOfReviews(product) {
      return reviews.filter((review) => review.productID === product.id).length;
    },
  },
  User: {
    reviews(user) {
      return reviews.filter((review) => review.authorID === user.id);
    },
    numberOfReviews(user) {
      return reviews.filter((review) => review.authorID === user.id).length;
    },
  },
  Review: {
    author(review) {
      return { __typename: "User", id: review.authorID };
    },
    product(review) {
      return { __typename: "Product", id: review.productID };
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

server.listen(4004).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

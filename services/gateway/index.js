const { ApolloServer } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
const { serializeQueryPlan } = require("@apollo/query-planner");

const supergraphSdl = new IntrospectAndCompose({
  subgraphs: [
    { name: "users", url: "http://localhost:4001/graphql" },
    { name: "products", url: "http://localhost:4002/graphql" },
    { name: "inventory", url: "http://localhost:4003/graphql" },
    { name: "reviews", url: "http://localhost:4004/graphql" },
  ],
});

const gateway = new ApolloGateway({
  supergraphSdl,
  experimental_didResolveQueryPlan: function (options) {
    if (options.requestContext.operationName !== "IntrospectionQuery") {
      console.log(serializeQueryPlan(options.queryPlan));
    }
  },
});

(async () => {
  const server = new ApolloServer({
    gateway,
    engine: false,
    subscriptions: false,
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();

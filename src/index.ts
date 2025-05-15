import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./TypeDefs";
import { resolvers } from "./Resolvers";

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start()
server.applyMiddleware({ app });

const PORT = process.env.PORT || 3001;
app.listen({ port: PORT }, () => {
  console.log(`Server is listening on port ${PORT}`);
});

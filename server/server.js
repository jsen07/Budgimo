const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const seedDefaultCategories = require("./config/seed");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { user } = authMiddleware({ req });
    return { user };
  },
  introspection: true,
  playground: true,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  if (process.env.NODE_ENV === "production") {
    const buildPath = path.join(__dirname, "../client/build");
    console.log("Serving React build from:", buildPath);

    app.use(express.static(buildPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(buildPath, "index.html"));
    });
  }

  db.once("open", async () => {
    await seedDefaultCategories();
    app.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT}`);
      console.log(
        `GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer();

import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import koaCors from '@koa/cors';
import Router, { RouterContext } from '@koa/router';
import { ApolloServer, IResolvers } from 'apollo-server-koa';
import { ApolloServerBase, Context, Config } from 'apollo-server-core';
import { DocumentNode } from 'graphql';
import { Server } from 'http';

type CreateMiddlewareParams = {
  typeDefs: DocumentNode;
  resolvers: IResolvers;
  context: Context;
  graphqlConfig: Config;
};

type ListenParams = {
  port: string;
  host: string;
};

class RecifeKoa {
  app = new Koa();
  router = new Router();

  constructor(bodyParser: any, cors: any, homepage: string) {
    this.app.use(koaBody(bodyParser));

    if (cors && cors.enabled) {
      this.app.use(koaCors(cors));
    }

    this.router.get('/', (ctx: RouterContext) => {
      ctx.body = homepage;
    });

    this.app.use(this.router.routes());
  }

  createApolloServer({
    typeDefs,
    resolvers,
    context,
    graphqlConfig
  }: CreateMiddlewareParams): ApolloServerBase {
    const apolloServer = new ApolloServer({
      ...graphqlConfig,
      resolvers,
      typeDefs,
      context
    });

    apolloServer.applyMiddleware({ app: this.app });

    return apolloServer;
  }

  listen({ port, host }: ListenParams, callback: () => void): Server {
    const server = this.app.listen({ port, host }, () => callback());

    return server;
  }
}

export default RecifeKoa;

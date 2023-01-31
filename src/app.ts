import cors from "cors";
import express, { Application, Request } from "express";
import { PORT, CORS_CREDENTIALS, CORS_ORIGIN, EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_SECURE } from "./config";
import errorMiddleware from "./middlewares/error.middleware";
import morganMiddleware from "./middlewares/morgan.middleware";
import { logger } from "./utils/logger";
import { AppRoutes } from "./interfaces/route.interface";
import db from "./db";
import Mailer from "./utils/mailer";



export default class App {
  public app: Application;
  public port: string | number;

  /**
   * The constructor function initializes the database, middlewares, routes, and error handling
   * @param {AppRoutes[]} routes - AppRoutes[] - This is an array of routes that we will be using in
   * our application.
   */
  constructor(routes: AppRoutes[]) {
    this.app = express();
    this.port = PORT || 8000;
    this.initializeEmail()
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.initDatabase();
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(
        `⚡️[server]: Server is running @ http://localhost:${this.port}`
      );
    });
  }

 /**
  * We're initializing the middlewares that we'll be using in our application
  */
  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(
      cors<Request>({
        credentials: CORS_CREDENTIALS,
        origin: CORS_ORIGIN,
        allowedHeaders:"*"
      })
    );
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morganMiddleware);
  }

  
 /**
  * It takes an array of routes, and for each route, it creates a URL based on the route's path, and
  * then registers the route with the Express app
  * @param {AppRoutes[]} routes - AppRoutes[] - This is an array of routes that we want to initialize.
  */
  private initializeRoutes(routes: AppRoutes[]): void {
    routes.forEach((route) => {
      const def = route["constructor"].name;
      logger.info(`Initializing Router ${def}`);
      const url = `/api/v1/${route.path || def}/`;
      logger.info(url)
      logger.info(__dirname)
      this.app.use(url, route.router);
    });
  }

/**
 * We connect to the database, and when the process exits, we disconnect from the database
 */
  private initDatabase() {
    db.connect();
    process.on("exit", () => {
      db.disconnect()
    });
  }

  private initializeEmail(){
    Mailer.getInstance({
      host:EMAIL_HOST,
      port:EMAIL_PORT,
      secure:EMAIL_SECURE,
      auth:{
        user:EMAIL_USER,
        pass:EMAIL_PASSWORD      
      }
    })
  }

 /**
  * We're using the errorMiddleware function we created earlier to handle any errors that occur in our
  * application
  */
  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

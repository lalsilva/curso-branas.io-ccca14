import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import GetAccount from "./application/usecase/GetAccount";
import LoggerConsole from "./infra/logger/LoggerConsole";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import Signup from "./application/usecase/Signup";
import MainController from "./infra/controller/MainController";

// composition root ou entry point
// criar o grafo de dependências utilizado no projeto

// framework and driver and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();

// interface adapter
const accoundRepository = new AccountRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();

// use case
const signup = new Signup(accoundRepository, logger);
const getAccount = new GetAccount(accoundRepository);

// interface adapter
new MainController(httpServer, signup, getAccount);
httpServer.listen(3000);
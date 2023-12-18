import AccountRepositoryDatabase from "./infra/repository/AccountRepositoryDatabase";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import GetAccount from "./application/usecase/GetAccount";
import LoggerConsole from "./infra/logger/LoggerConsole";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import Signup from "./application/usecase/Signup";
import MainController from "./infra/controller/MainController";

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const accoundRepository = new AccountRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();
const signup = new Signup(accoundRepository, logger);
const getAccount = new GetAccount(accoundRepository);

new MainController(httpServer, signup, getAccount);
httpServer.listen(3000);
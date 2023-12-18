import AcceptRide from "../src/application/usecase/AcceptRide";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import Signup from "../src/application/usecase/Signup";
import StartRide from "../src/application/usecase/StartRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let getRide: GetRide;
let startRide: StartRide;
let databaseConnection: PgPromiseAdapter;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const rideRepository = new RideRepositoryDatabase();
    const logger = new LoggerConsole();
    signup = new Signup(accountRepository, logger);
    getAccount = new GetAccount(accountRepository);
    requestRide = new RequestRide(accountRepository, rideRepository, logger);
    acceptRide = new AcceptRide(rideRepository, accountRepository, logger);
    getRide = new GetRide(rideRepository, logger);
    startRide = new StartRide(rideRepository, logger);
});

test("Deve iniciar uma corrida", async () => {
    const inputSignupDriver = {
        name: "John Driver",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        carPlate: "DOT1823",
        isPassenger: false,
        isDriver: true,
        password: "123456"
    }
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputSignupPassenger = {
        name: "John Passenger",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -21.1837009,
        fromLong: -47.8415536,
        toLat: -21.1824996,
        toLong: -47.8106936
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId
    }
    await acceptRide.execute(inputAcceptRide);
    const inputStartRide = {
        rideId: outputRequestRide.rideId
    }
    await startRide.execute(inputStartRide);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("in_progress");
});

afterEach(async () => {
    await databaseConnection.close();
});
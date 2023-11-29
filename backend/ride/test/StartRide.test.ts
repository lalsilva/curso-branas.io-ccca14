import AcceptRide from "../src/AcceptRide";
import AccountDAODatabase from "../src/AccountDAODataBase";
import GetAccount from "../src/GetAccount";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAODatabase";
import Signup from "../src/Signup";
import StartRide from "../src/StartRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let getRide: GetRide;
let startRide: StartRide;

beforeEach(() => {
    const accountDAO = new AccountDAODatabase();
    const rideDAO = new RideDAODatabase();
    const logger = new LoggerConsole();
    signup = new Signup(accountDAO, logger);
    getAccount = new GetAccount(accountDAO);
    requestRide = new RequestRide(rideDAO, logger);
    acceptRide = new AcceptRide(rideDAO, logger);
    getRide = new GetRide(rideDAO);
    startRide = new StartRide(rideDAO, logger);
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
    const outputGetAccountDriver = await getAccount.execute(outputSignupDriver.accountId);
    expect(outputGetAccountDriver.is_driver).toBe(true);
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
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe('requested');
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId
    }
    const outputAcceptRide = await acceptRide.execute(inputAcceptRide);
    expect(outputAcceptRide.rideId).toBe(outputRequestRide.rideId);
    const outputStartRide = await startRide.execute(outputAcceptRide.rideId);
    expect(outputStartRide.rideId).toBe(outputAcceptRide.rideId);
});
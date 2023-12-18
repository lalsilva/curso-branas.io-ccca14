import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import Signup from "../src/application/usecase/Signup";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: PgPromiseAdapter;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const rideRepository = new RideRepositoryDatabase(databaseConnection);
    const logger = new LoggerConsole();
    signup = new Signup(accountRepository, logger);
    requestRide = new RequestRide(accountRepository, rideRepository, logger);
    getRide = new GetRide(rideRepository, logger);
});

test("Deve solicitar uma corrida", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -21.1837009,
        fromLong: -47.8415536,
        toLat: -21.1824996,
        toLong: -47.8106936
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("requested");
});

test("Não deve poder solicitar uma corrida se não for um passageiro", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: false,
        isDriver: true,
        carPlate: "DOT1823",
        password: "123456"
    };
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        status: 'requested',
        fromLat: -21.1837009,
        fromLong: -47.8415536,
        toLat: -21.1824996,
        toLong: -47.8106936,
        date: new Date()
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Não é passageiro"));
});

test("Não deve poder solicitar uma corrida se já existir uma solicitação para o passageiro", async () => {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        status: 'requested',
        fromLat: -21.1837009,
        fromLong: -47.8415536,
        toLat: -21.1824996,
        toLong: -47.8106936,
        date: new Date()
    }
    await requestRide.execute(inputRequestRide);
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Já exsite uma corrida em andamento para esse passageiro"));
});

afterEach(async () => {
    await databaseConnection.close();
});
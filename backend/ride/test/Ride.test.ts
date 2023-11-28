import AccountDAODatabase from "../src/AccountDAODataBase";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAODatabase";
import Signup from "../src/Signup";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
    const accountDAO = new AccountDAODatabase();
    const rideDAO = new RideDAODatabase();
    const logger = new LoggerConsole();
    signup = new Signup(accountDAO, logger);
    requestRide = new RequestRide(rideDAO, logger);
    getRide = new GetRide(rideDAO);
});

test.only("Deve solicitar uma corrida", async () => {
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
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputRequestRide.rideId).toBeDefined();
    expect(outputGetRide.passenger_id).toBe(inputRequestRide.passengerId);
});

test("Não deve solicitar uma corrida se não for um passageiro", async () => {
    // given
    const inputRequestRide = {
        passengerId: "024e2bc6-1755-4482-a1ea-176253427012",
        status: 'requested',
        fromLat: -21.1837009,
        fromLong: -47.8415536,
        toLat: -21.1824996,
        toLong: -47.8106936,
        date: new Date()
    }
    // then
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Não é passageiro"));
});

test("Não deve solicitar uma corrida se já existir uma solicitação para o passageiro", async () => {
    // given
    const inputRequestRide = {
        passengerId: "f194e3d0-f85a-4317-90ba-23c5ac1660a5",
        status: 'requested',
        fromLat: -21.1837009,
        fromLong: -47.8415536,
        toLat: -21.1824996,
        toLong: -47.8106936,
        date: new Date()
    }
    // then
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Já existe uma corrida em percurso para esse passageiro"));
});
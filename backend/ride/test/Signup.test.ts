import AccountDAO from "../src/AccountDAO";
import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import sinon from "sinon";
import Logger from "../src/Logger";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    signup = new Signup();
    getAccount = new GetAccount();
});

test("Deve criar uma conta para o passageiro", async function () {
    const stubAccountDAOSave = sinon.stub(AccountDAO.prototype, "save").resolves();
    const stubAccountDAOGetByEmail = sinon.stub(AccountDAO.prototype, "getByEmail").resolves(null);
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const stubAccountDAOGetById = sinon.stub(AccountDAO.prototype, "getById").resolves(inputSignup);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    // then
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    stubAccountDAOSave.restore();
    stubAccountDAOGetByEmail.restore();
    stubAccountDAOGetById.restore();
});

test("Não deve criar uma conta se o e-mail for duplicado", async function () {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    // when
    await signup.execute(inputSignup);
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Conta duplicada"));
});

test("Não deve criar uma conta se o nome for inválido", async function () {
    // given
    const inputSignup = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    // when
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Nome inválido"));
});

test("Não deve criar uma conta se o e-mail for inválido", async function () {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    // when
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("E-mail inválido"));
});

test("Não deve criar uma conta se o cpf for inválido", async function () {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "111111111111",
        isPassenger: true,
        password: "123456"
    };
    // when
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("CPF inválido"));
});

test("Deve criar uma conta para o motorista", async function () {
    const spyLoggerLog = sinon.spy(Logger.prototype, "log");
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        carPlate: "DOT1823",
        isPassenger: false,
        isDriver: true,
        password: "123456"
    };
    // when
    const outputSignup = await signup.execute(inputSignup);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    // then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(spyLoggerLog.calledOnce).toBeTruthy();
    expect(spyLoggerLog.calledWith("signup John Doe")).toBeTruthy();
});

test("Não deve criar uma conta para o motorista com a placa inválida", async function () {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        carPlate: "DOT182",
        isPassenger: false,
        isDriver: true,
        password: "123456"
    };
    // when
    await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Placa inválida"));
});
import Signup from "../src/application/usecase/Signup";
import GetAccount from "../src/application/usecase/GetAccount";
import sinon from "sinon";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import AccountRepository from "../src/application/repository/AccountRepository";
import Logger from "../src/application/logger/Logger";
import Account from "../src/domain/Account";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";

let signup: Signup;
let getAccount: GetAccount;
let databaseConnection: PgPromiseAdapter;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const logger = new LoggerConsole();
    signup = new Signup(accountRepository, logger);
    getAccount = new GetAccount(accountRepository);
});

test("Deve criar uma conta para o passageiro", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount?.name).toBe(inputSignup.name);
    expect(outputGetAccount?.email).toBe(inputSignup.email);
});

test("Deve criar uma conta para o passageiro com stub", async function () {
    const stubAccountRepositorySave = sinon.stub(AccountRepositoryDatabase.prototype, "save").resolves();
    const stubAccountRepositoryGetByEmail = sinon.stub(AccountRepositoryDatabase.prototype, "getByEmail").resolves(undefined);
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        carPlate: "",
        isPassenger: true,
        isDriver: false,
        password: "123456"
    };
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const stubAccountRepositoryGetById = sinon.stub(AccountRepositoryDatabase.prototype, "getById").resolves(Account.create(
        inputSignup.name,
        inputSignup.email,
        inputSignup.cpf,
        inputSignup.carPlate,
        inputSignup.isPassenger,
        inputSignup.isDriver
    ));
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    // then
    expect(outputGetAccount?.name).toBe(inputSignup.name);
    expect(outputGetAccount?.email).toBe(inputSignup.email);
    stubAccountRepositorySave.restore();
    stubAccountRepositoryGetByEmail.restore();
    stubAccountRepositoryGetById.restore();
});

test("Deve criar uma conta para o passageiro com mock", async function () {
    const mockLogger = sinon.mock(LoggerConsole.prototype);
    mockLogger.expects("log").withArgs("signup John Doe").once();
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    const outputSignup = await signup.execute(inputSignup);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    // then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount?.name).toBe(inputSignup.name);
    expect(outputGetAccount?.email).toBe(inputSignup.email);
    mockLogger.verify();
    mockLogger.restore();
});

test("Deve criar uma conta para o passageiro com fake", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    const accounts: any[] = [];
    const accountRepository: AccountRepository = {
        async save (account: any): Promise<void> {
            accounts.push(account);
        },
        async getById (accountId: string): Promise<any> {
            return accounts.find((account: any) => account.accountId === accountId);
        },
        async getByEmail (email: string): Promise<any> {
            return accounts.find((account: any) => account.email === email);
        }
    }
    const logger: Logger = {
        log (message: string): void {
        }
    }
    const signup = new Signup(accountRepository, logger);
    const getAccount = new GetAccount(accountRepository);
    const outputSignup = await signup.execute(inputSignup);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    // then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount?.name).toBe(inputSignup.name);
    expect(outputGetAccount?.email).toBe(inputSignup.email);
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
    const spyLoggerLog = sinon.spy(LoggerConsole.prototype, "log");
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
    expect(outputGetAccount?.name).toBe(inputSignup.name);
    expect(outputGetAccount?.email).toBe(inputSignup.email);
    expect(spyLoggerLog.calledOnce).toBeTruthy();
    expect(spyLoggerLog.calledWith("signup John Doe")).toBeTruthy();
    spyLoggerLog.restore();
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

afterEach(async () => {
    await databaseConnection.close();
})
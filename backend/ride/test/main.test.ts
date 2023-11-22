import { getAccount, signup } from "../src/main";

test.each([
    "82537745086",
    "33478825040",
    "85718998000",
])("Deve criar uma conta para o passageiro", async function (cpf: string) {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf,
        isPassenger: true,
        password: "123456"
    };
    // when
    const outputSignup = await signup(inputSignup);
    const outputGetAccount = await getAccount(outputSignup.accountId);
    // then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
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
    await signup(inputSignup);
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Conta duplicada"));
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
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Nome inválido"));
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
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("E-mail inválido"));
});

test.each([
    "",
    undefined,
    null,
    "111",
    "111111111111",
    "11111111111"
])("Não deve criar uma conta se o cpf for inválido", async function (cpf: any) {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf,
        isPassenger: true,
        password: "123456"
    };
    // when
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("CPF inválido"));
});

test("Deve criar uma conta para o motorista", async function () {
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
    const outputSignup = await signup(inputSignup);
    const outputGetAccount = await getAccount(outputSignup.accountId);
    // then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
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
    await expect(() => signup(inputSignup)).rejects.toThrow(new Error("Placa inválida"));
});
import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;
}

test("Deve criar uma conta para o passageiro", async function () {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "82537745086",
        isPassenger: true,
        password: "123456"
    };
    // when
    const responseSingup = await axios.post(`http://localhost:3000/signup`, inputSignup);
    const outputSignup = responseSingup.data;
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
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
    await axios.post(`http://localhost:3000/signup`, inputSignup);
    const responseSingup = await axios.post(`http://localhost:3000/signup`, inputSignup);
    const outputSignup = responseSingup.data;
    // then
    expect(responseSingup.status).toBe(422);
    expect(outputSignup.message).toBe("Conta duplicada");
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
    const responseSingup = await axios.post(`http://localhost:3000/signup`, inputSignup);
    const outputSignup = responseSingup.data;
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
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
    const responseSingup = await axios.post(`http://localhost:3000/signup`, inputSignup);
    const outputSignup = responseSingup.data;
    // then
    expect(responseSingup.status).toBe(422);
    expect(outputSignup.message).toBe("Placa inválida");
});
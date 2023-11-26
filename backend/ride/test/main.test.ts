import axios from "axios";
// import { requestRide } from "../src/main";

axios.defaults.validateStatus = function () {
    return true;
}

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
    const responseSingup = await axios.post(`http://localhost:3000/signup`, inputSignup);
    const outputSignup = responseSingup.data;
    // then
    expect(responseSingup.status).toBe(422);
    expect(outputSignup.message).toBe("Nome inválido");
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
    const responseSingup = await axios.post(`http://localhost:3000/signup`, inputSignup);
    const outputSignup = responseSingup.data;
    // then
    expect(responseSingup.status).toBe(422);
    expect(outputSignup.message).toBe("E-mail inválido");
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
    const responseSingup = await axios.post(`http://localhost:3000/signup`, inputSignup);
    const outputSignup = responseSingup.data;
    // then
    expect(responseSingup.status).toBe(422);
    expect(outputSignup.message).toBe("CPF inválido");
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

// test("Deve solicitar uma corrida", async () => {
//     // given
//     const inputRequestRide = {
//         passengerId: "f194e3d0-f85a-4317-90ba-23c5ac1660a5",
//         status: 'requested',
//         fromLat: -21.1837009,
//         fromLong: -47.8415536,
//         toLat: -21.1824996,
//         toLong: -47.8106936,
//         date: new Date()
//     }
//     // when
//     const outputRequestRide = await requestRide(inputRequestRide);
//     // then
//     expect(outputRequestRide.rideId).toBeDefined();
// });

// test("Não deve solicitar uma corrida se não for um passageiro", async () => {
//     // given
//     const inputRequestRide = {
//         passengerId: "024e2bc6-1755-4482-a1ea-176253427012",
//         status: 'requested',
//         fromLat: -21.1837009,
//         fromLong: -47.8415536,
//         toLat: -21.1824996,
//         toLong: -47.8106936,
//         date: new Date()
//     }
//     // then
//     await expect(() => requestRide(inputRequestRide)).rejects.toThrow(new Error("Não é passageiro"));
// });

// test("Não deve solicitar uma corrida se já existir uma solicitação para o passageiro", async () => {
//     // given
//     const inputRequestRide = {
//         passengerId: "f194e3d0-f85a-4317-90ba-23c5ac1660a5",
//         status: 'requested',
//         fromLat: -21.1837009,
//         fromLong: -47.8415536,
//         toLat: -21.1824996,
//         toLong: -47.8106936,
//         date: new Date()
//     }
//     // then
//     await expect(() => requestRide(inputRequestRide)).rejects.toThrow(new Error("Já existe uma corrida em percurso para esse passageiro"));
// });
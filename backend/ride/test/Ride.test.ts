// import { requestRide } from "../src/RequestRide";

import RequestRide from "../src/RequestRide";

let requestRide: RequestRide;

beforeEach(() => {
    requestRide = new RequestRide();
});

test("Deve solicitar uma corrida", async () => {
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
    // when
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    // then
    expect(outputRequestRide.rideId).toBeDefined();
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
import crypto from "crypto";
import pgp from "pg-promise";

export function validateCpf(cpf: string) {
	if (!cpf) return false;
	cpf = clean(cpf);
	if (isInvalidCpfLength(cpf)) return false;
	if (isRepeatedCpfDigits(cpf)) return false;
	const dg1 = calculateDigit(cpf, 10);
	const dg2 = calculateDigit(cpf, 11);
	return extractCheckDigit(cpf) == `${dg1}${dg2}`;
}

function clean(cpf: string) {
	return cpf.replace(/\D/g, "");
}

function isInvalidCpfLength(cpf: string) {
	return cpf.length !== 11;
}

function isRepeatedCpfDigits(cpf: string) {
	return cpf.split("").every(c => c === cpf[0]);
}

function calculateDigit(cpf: string, factor: number) {
	let total = 0;
	for (const digit of cpf) {
		if (factor > 1) total += parseInt(digit) * factor--;
	}
	const rest = total % 11;
	return (rest < 2) ? 0 : 11 - rest;
}

function extractCheckDigit(cpf: string) {
	return cpf.slice(9);
}

export type TAccount = {
	accountId?: string;
	name: string;
	email: string;
	cpf: string;
	isPassenger?: boolean;
	isDriver?: boolean;
	carPlate?: string;
	password: string;
}

export async function signup(input: any): Promise<any> {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	try {
		const accountId = crypto.randomUUID();
		const [account] = await connection.query("SELECT * FROM cccat14.account WHERE email = $1", [input.email]);
		if (account) throw new Error("Conta duplicada");
		if (isInvalidName(input.name)) throw new Error("Nome inválido");
		if (isInvalidEmail(input.email)) throw new Error("E-mail inválido");
		if (!validateCpf(input.cpf)) throw new Error("CPF inválido");
		if (input.isDriver && isInvalidCarPlate(input.carPlate)) throw new Error("Placa inválida");
		await connection.query("INSERT INTO cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) VALUES ($1, $2, $3, $4, $5, $6, $7)", [accountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
		return {
			accountId
		};
	} finally {
		await connection.$pool.end();
	}
}

function isInvalidName(name: string) {
	return !RegExp(/[a-zA-Z] [a-zA-Z]+/).exec(name);
}

function isInvalidEmail(email: string) {
	return !RegExp(/^(.+)@(.+)$/).exec(email);
}

function isInvalidCarPlate(carPlate: string) {
	return !RegExp(/[A-Z]{3}\d{4}/).exec(carPlate);
}

interface IAccount {
	account_id: string;
	name: string;
	email: string;
	cpf: string;
	car_plate: string;
	is_passenger: boolean;
	is_driver: boolean;
}

export async function getAccount(accountId: string): Promise<IAccount> {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	const [account] = await connection.query("SELECT * FROM cccat14.account WHERE account_id = $1", [accountId]);
	connection.$pool.end();
	return account;
}

export type TRide = {
	rideId?: string;
	passengerId: string;
	driverId?: string;
	status: string;
	fare?: number;
	distance?: number;
	fromLat: number;
	fromLong: number;
	toLat: number;
	toLong: number;
	date: Date;
}

interface IRide {
	ride_id: string;
	passenger_id: string;
	driver_id: string;
	status: string;
	fare: number;
	distance: number;
	from_lat: number;
	from_long: number;
	to_lat: number;
	to_long: number;
	date: Date;
}

/**
 * Método responsável por criar uma solicitação de corrida
 * @param inputRequestRide Estrutura de dados
 *   {
 *     passengerId: string,
 *     latFrom: number,
 *     lonFrom: number,
 *     latTo: number,
 *     lonTo: number
 *   }
 * @returns account Resultado da consulta no banco de dados
 */
export async function requestRide(input: TRide): Promise<any> {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	try {
		const account: IAccount = await getAccount(input.passengerId);
		if (!account.is_passenger) throw new Error("Não é passageiro");
		const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE passenger_id = $1 AND status <> 'completed'", [input.passengerId]);
		if (ride) throw new Error("Já existe uma corrida em percurso para esse passageiro");
		const rideId = crypto.randomUUID();
		await connection.query("INSERT INTO cccat14.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [rideId, input.passengerId, input.status, input.fromLat, input.fromLong, input.toLat, input.toLong, input.date]);
		return {
			rideId
		};
	} finally {
		connection.$pool.end();
	}
}

export async function getRide(rideId: string): Promise<IRide> {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE ride_id = $1", [rideId]);
	connection.$pool.end();
	return ride;
}
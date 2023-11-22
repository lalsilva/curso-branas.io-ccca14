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

export async function signup(input: any): Promise<any> {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	try {
		const accountId = crypto.randomUUID();
		const [account] = await connection.query("select * from cccat14.account where email = $1", [input.email]);
		if (account) throw new Error("Conta duplicada");
		if (isInvalidName(input.name)) throw new Error("Nome inválido");
		if (isInvalidEmail(input.email)) throw new Error("E-mail inválido");
		if (!validateCpf(input.cpf)) throw new Error("CPF inválido");
		if (input.isDriver && isInvalidCarPlate(input.carPlate)) throw new Error("Placa inválida");
		await connection.query("insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [accountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
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

export async function getAccount(accountId: string) {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	const [account] = await connection.query("SELECT * FROM cccat14.account WHERE account_id = $1", [accountId]);
	connection.$pool.end();
	return account;
}
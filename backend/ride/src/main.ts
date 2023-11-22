import crypto from "crypto";
import pgp from "pg-promise";

export function validateCpf(cpf: string) {
	if (!cpf) return false;
	cpf = cpf.replace(/\D/g, "");
	if (cpf.length !== 11) return false;
	if (cpf.split("").every(c => c === cpf[0])) return false;
	let d1 = 0;
	let d2 = 0;
	for (let nCount = 1; nCount < cpf.length - 1; nCount++) {
		const digito = parseInt(cpf.substring(nCount - 1, nCount));
		d1 = d1 + (11 - nCount) * digito;
		d2 = d2 + (12 - nCount) * digito;
	};
	let rest = (d1 % 11);
	let dg1 = (rest < 2) ? 0 : 11 - rest;
	d2 += 2 * dg1;
	rest = (d2 % 11);
	let dg2 = rest < 2 ? 0 : 11 - rest;
	let nDigVerific = cpf.substring(cpf.length - 2, cpf.length);
	const nDigResult = "" + dg1 + "" + dg2;
	return nDigVerific == nDigResult;
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

export async function getAccount(accountId: string) {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	const [account] = await connection.query("SELECT * FROM cccat14.account WHERE account_id = $1", [accountId]);
	connection.$pool.end();
	return account;
}
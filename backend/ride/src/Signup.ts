import crypto from "crypto";
import AccountDAO from "./AccountDAO";
import { validateCpf } from "./CpfValidator";

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
	const accountDAO = new AccountDAO();
	input.accountId = crypto.randomUUID();
	const account = await accountDAO.getByEmail(input.email);
	if (account) throw new Error("Conta duplicada");
	if (isInvalidName(input.name)) throw new Error("Nome inválido");
	if (isInvalidEmail(input.email)) throw new Error("E-mail inválido");
	if (!validateCpf(input.cpf)) throw new Error("CPF inválido");
	if (input.isDriver && isInvalidCarPlate(input.carPlate)) throw new Error("Placa inválida");
	await accountDAO.save(input);
	return {
		accountId: input.accountId,
	};
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
import crypto from "crypto";
import { validateCpf } from "./CpfValidator";
import Logger from "./Logger";
import SignupAccountDAO from "./SignupAccountDAO";

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

export default class Signup {

	constructor(private accountDAO: SignupAccountDAO, private logger: Logger) { }

	async execute(input: any) {
		this.logger.log(`signup ${input.name}`);
		input.accountId = crypto.randomUUID();
		const account = await this.accountDAO.getByEmail(input.email);
		if (account) throw new Error("Conta duplicada");
		if (this.isInvalidName(input.name)) throw new Error("Nome inválido");
		if (this.isInvalidEmail(input.email)) throw new Error("E-mail inválido");
		if (!validateCpf(input.cpf)) throw new Error("CPF inválido");
		if (input.isDriver && this.isInvalidCarPlate(input.carPlate)) throw new Error("Placa inválida");
		await this.accountDAO.save(input);
		return {
			accountId: input.accountId,
		};
	}

	isInvalidName(name: string) {
		return !RegExp(/[a-zA-Z] [a-zA-Z]+/).exec(name);
	}

	isInvalidEmail(email: string) {
		return !RegExp(/^(.+)@(.+)$/).exec(email);
	}

	isInvalidCarPlate(carPlate: string) {
		return !RegExp(/[A-Z]{3}\d{4}/).exec(carPlate);
	}
}
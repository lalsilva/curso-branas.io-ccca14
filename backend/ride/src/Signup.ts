import Logger from "./Logger";
import SignupAccountDAO from "./SignupAccountRepository";
import Account from "./Account";

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

	async execute(input: Input): Promise<Output> {
		this.logger.log(`signup ${input.name}`);
		const existingAccount = await this.accountDAO.getByEmail(input.email);
		if (existingAccount) throw new Error("Conta duplicada");
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate || "", !!input.isPassenger, !!input.isDriver);
		await this.accountDAO.save(account);
		return {
			accountId: account.accountId,
		};
	}
}

type Input = {
	name: string;
	email: string;
	cpf: string;
	carPlate?: string;
	isPassenger?: boolean;
	isDriver?: boolean;
	password: string;
}

type Output = {
	accountId: string;
}
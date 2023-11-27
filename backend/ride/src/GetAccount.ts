import AccountDAO from "./AccountDAO";

export interface IAccount {
	account_id: string;
	name: string;
	email: string;
	cpf: string;
	car_plate: string;
	is_passenger: boolean;
	is_driver: boolean;
}

export default class GetAccount {
	accountDAO: AccountDAO;

	constructor() {
		this.accountDAO = new AccountDAO();
	}

	async execute(accountId: string): Promise<IAccount> {
		const account = await this.accountDAO.getById(accountId);
		return account;
	}
}
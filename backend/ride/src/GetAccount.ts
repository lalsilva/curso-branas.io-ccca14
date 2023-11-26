import AccountDAO from "./AccountDAO";

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
	const accountDAO = new AccountDAO();
	const account = await accountDAO.getById(accountId);
	return account;
}
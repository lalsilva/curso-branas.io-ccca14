import Account from "./Account";
import GetAccountAccountRepository from "./GetAccountAccountRepository";

export default class GetAccount {
	constructor(private accountRepository: GetAccountAccountRepository) { }

	async execute(accountId: string): Promise<Account | undefined> {
		const account = await this.accountRepository.getById(accountId);
		return account;
	}
}
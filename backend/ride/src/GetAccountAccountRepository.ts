import Account from "./Account";

export default interface GetAccountAccountRepository {
    getById(accountId: string): Promise<Account | undefined>;
}
import Account from "./Account";

export default interface SignupAccountRepository {
    save(account: Account): Promise<void>;
    getByEmail(email: string): Promise<Account | undefined>;
}
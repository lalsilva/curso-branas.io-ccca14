import AccountRepository from '../../application/repository/AccountRepository';
import Account from '../../domain/Account';
import DatabaseConnection from '../database/DatabaseConnection';

export default class AccountRepositoryDatabase implements AccountRepository {

    constructor(readonly connection: DatabaseConnection) {
    }

    async save(account: Account) {
        await this.connection.query("INSERT INTO cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) VALUES ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
    }

    async getById(accountId: string): Promise<Account | undefined> {
        const [account] = await this.connection.query("SELECT * FROM cccat14.account WHERE account_id = $1", [accountId]);
        if (!account) return undefined;
        return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver);
    }

    async getByEmail(email: string): Promise<Account | undefined> {
        const [account] = await this.connection.query("SELECT * FROM cccat14.account WHERE email = $1", [email]);
        if (!account) return undefined;
        return Account.restore(account.account_id, account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver);
    }
}
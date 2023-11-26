import pgp from 'pg-promise';

export default class AccountDAO {
    async save(account: any) {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        await connection.query("INSERT INTO cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) VALUES ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
        await connection.$pool.end();
    }

    async getById(accountId: string) {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const [account] = await connection.query("SELECT * FROM cccat14.account WHERE account_id = $1", [accountId]);
        await connection.$pool.end();
        return account;
    }

    async getByEmail(email: string) {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const [account] = await connection.query("SELECT * FROM cccat14.account WHERE email = $1", [email]);
        await connection.$pool.end();
        return account;
    }
}
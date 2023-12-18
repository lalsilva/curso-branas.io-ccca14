import express, { Request, Response } from 'express';
import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/GetAccount';
import AccountRepositoryDatabase from './infra/repository/AccountRepositoryDatabase';
import LoggerConsole from './infra/logger/LoggerConsole';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';

export const PORT: number = 3000;

const app = express();
app.use(express.json());

app.post("/signup", async function (req: Request, res: Response) {
	try {
		const input = req.body;
		const databaseConnection = new PgPromiseAdapter();
		const accoundRepository = new AccountRepositoryDatabase(databaseConnection);
		const logger = new LoggerConsole();
		const signup = new Signup(accoundRepository, logger);
		const output = await signup.execute(input);
		databaseConnection.close();
		return res.json(output);
	} catch (e: any) {
		res.status(422).json({
			message: e.message
		});
	}
});

app.get("/accounts/:accountId", async function (req: Request, res: Response) {
	const accountId = req.params.accountId;
    const databaseConnection = new PgPromiseAdapter();
	const accoundRepository = new AccountRepositoryDatabase(databaseConnection);
	const getAccount = new GetAccount(accoundRepository);
	const output = await getAccount.execute(accountId);
	databaseConnection.close();
	return res.json(output);
});

app.listen(PORT, (): void => console.log(`Server running on port ${PORT}`));

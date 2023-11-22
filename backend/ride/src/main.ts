import crypto from "crypto";
import pgp from "pg-promise";

export function validateCpf(str: string) {
	if (str !== null) {
		if (str !== undefined) {
			if (str.length >= 11 && str.length <= 14) {
				// cleaning cpf
				str = str
					.replace('.', '')
					.replace('.', '')
					.replace('-', '')
					.replace(" ", "");

				if (!str.split("").every(c => c === str[0])) {
					try {
						let d1, d2;
						let dg1, dg2, rest;
						let digito;
						let nDigResult;
						d1 = d2 = 0;
						dg1 = dg2 = rest = 0;

						for (let nCount = 1; nCount < str.length - 1; nCount++) {
							// if (isNaN(parseInt(str.substring(nCount -1, nCount)))) {
							// 	return false;
							// } else {

							digito = parseInt(str.substring(nCount - 1, nCount));
							d1 = d1 + (11 - nCount) * digito;

							d2 = d2 + (12 - nCount) * digito;
							// }
						};

						rest = (d1 % 11);

						dg1 = (rest < 2) ? dg1 = 0 : 11 - rest;
						d2 += 2 * dg1;
						rest = (d2 % 11);
						if (rest < 2)
							dg2 = 0;
						else
							dg2 = 11 - rest;

						let nDigVerific = str.substring(str.length - 2, str.length);
						nDigResult = "" + dg1 + "" + dg2;
						return nDigVerific == nDigResult;

						// just in case...
					} catch (e) {
						console.error("Erro !" + e);

						return false;
					}
				} else return false

			} else return false;
		}


	} else return false;
}

export async function signup(input: any): Promise<any> {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	try {
		const accountId = crypto.randomUUID();
		const [account] = await connection.query("select * from cccat14.account where email = $1", [input.email]);
		if (account) return -4;
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) return -3;
		if (!input.email.match(/^(.+)@(.+)$/)) return -2;
		if (!validateCpf(input.cpf)) return -1;
		if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) return -5;
		await connection.query("insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [accountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
		return {
			accountId
		};
	} finally {
		await connection.$pool.end();
	}
}

export async function getAccount(accountId: string) {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	const [account] = await connection.query("SELECT * FROM cccat14.account WHERE account_id = $1", [accountId]);
	connection.$pool.end();
	return account;
}
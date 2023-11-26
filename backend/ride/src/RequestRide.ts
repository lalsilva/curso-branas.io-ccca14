export type TRide = {
	rideId?: string;
	passengerId: string;
	driverId?: string;
	status: string;
	fare?: number;
	distance?: number;
	fromLat: number;
	fromLong: number;
	toLat: number;
	toLong: number;
	date: Date;
}

interface IRide {
	ride_id: string;
	passenger_id: string;
	driver_id: string;
	status: string;
	fare: number;
	distance: number;
	from_lat: number;
	from_long: number;
	to_lat: number;
	to_long: number;
	date: Date;
}

/**
 * Método responsável por criar uma solicitação de corrida
 * @param inputRequestRide Estrutura de dados
 *   {
 *     passengerId: string,
 *     latFrom: number,
 *     lonFrom: number,
 *     latTo: number,
 *     lonTo: number
 *   }
 * @returns account Resultado da consulta no banco de dados
 */
export async function requestRide(input: TRide): Promise<any> {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	try {
		const account: IAccount = await getAccount(input.passengerId);
		if (!account.is_passenger) throw new Error("Não é passageiro");
		const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE passenger_id = $1 AND status <> 'completed'", [input.passengerId]);
		if (ride) throw new Error("Já existe uma corrida em percurso para esse passageiro");
		const rideId = crypto.randomUUID();
		await connection.query("INSERT INTO cccat14.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [rideId, input.passengerId, input.status, input.fromLat, input.fromLong, input.toLat, input.toLong, input.date]);
		return {
			rideId
		};
	} finally {
		connection.$pool.end();
	}
}

export async function getRide(rideId: string): Promise<IRide> {
	const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
	const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE ride_id = $1", [rideId]);
	connection.$pool.end();
	return ride;
}
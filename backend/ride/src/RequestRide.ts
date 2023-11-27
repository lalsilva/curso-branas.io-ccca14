import crypto from "crypto";
import GetAccount, { IAccount } from './GetAccount';
import GetRide, { IRide } from './GetRide';
import RideDAO from './RideDAO';

export type TRide = {
	rideId: string;
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

export default class RequestRide {
	rideDAO: RideDAO;

	constructor() {
		this.rideDAO = new RideDAO();
	}

	/**
	 * Método responsável por criar uma solicitação de corrida
	 * @param input Estrutura de dados
	 *   {
	 *     passengerId: string,
	 *     latFrom: number,
	 *     lonFrom: number,
	 *     latTo: number,
	 *     lonTo: number
	 *   }
	 * @returns account Resultado da consulta no banco de dados
	 */
	async execute(input: any) {
		const getAccount = new GetAccount();
		const getRide = new GetRide();
		const account: IAccount = await getAccount.execute(input.passengerId);
		if (!account.is_passenger) throw new Error("Não é passageiro");
		const ride: IRide = await getRide.execute(input.rideId);
		if (ride) throw new Error("Já existe uma corrida em percurso para esse passageiro");
		const rideId = crypto.randomUUID();
		await this.rideDAO.save(input);
		return {
			rideId
		};
	}
}
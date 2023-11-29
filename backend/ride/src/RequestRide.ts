import crypto from "crypto";
import RideDAO from './RideDAO';
import Logger from "./Logger";
import AccountDAO from "./AccountDAO";

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

	constructor(private accountDAO: AccountDAO, private rideDAO: RideDAO, private logger: Logger) {
	}

	/**
	 * Método responsável por criar uma solicitação de corrida
	 * @param input Estrutura de dados
	 *   {
	 *     passengerId: string,
	 *     fromLat: number,
	 *     fromLong: number,
	 *     toLat: number,
	 *     toLong: number
	 *   }
	 * @returns account Resultado da consulta no banco de dados
	 */
	async execute(input: any) {
		this.logger.log(`requestRide`);
		const account = await this.accountDAO.getById(input.passengerId);
		if (!account.is_passenger) throw new Error("Não é passageiro");
		const ride = await this.rideDAO.getNotCompletedByPassengerId(input.passengerId);
		if (ride) throw new Error("Já exsite uma corrida em andamento para esse passageiro");
		input.rideId = crypto.randomUUID();
		input.status = 'requested';
		input.date = new Date();
		await this.rideDAO.save(input);
		return {
			rideId: input.rideId,
		};
	}
}
import crypto from "crypto";
import RideDAO from './RideRepository';
import Logger from "./Logger";
import AccountDAO from "./AccountRepository";
import Ride from "./Ride";

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
	async execute(input: Input): Promise<Output> {
		this.logger.log(`requestRide`);
		const account = await this.accountDAO.getById(input.passengerId);
		if (!account) throw new Error("Essa conta não existe");
		if (!account.isPassenger) throw new Error("Não é passageiro");
		const activeRide = await this.rideDAO.getActiveRideByPassengerId(input.passengerId);
		if (activeRide) throw new Error("Já exsite uma corrida em andamento para esse passageiro");
		const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
		await this.rideDAO.save(ride);
		return {
			rideId: ride.rideId,
		};
	}
}

type Input = {
	passengerId: string;
	fromLat: number;
	fromLong: number;
	toLat: number;
	toLong: number;
}

type Output = {
	rideId: string;
}
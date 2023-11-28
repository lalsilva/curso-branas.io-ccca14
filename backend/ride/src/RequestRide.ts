import crypto from "crypto";
import GetAccount, { IAccount } from './GetAccount';
import GetRide, { IRide } from './GetRide';
import RideDAO from './RideDAO';
import SignupAccountDAO from "./SignupAccountDAO";
import Logger from "./Logger";

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

	constructor(private rideDAO: RideDAO, private logger: Logger) {
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
		input.rideId = crypto.randomUUID();
        input.status = 'requested';
        input.date = new Date();
		// const getAccount = new GetAccount();
		// const getRide = new GetRide();
		// const account: IAccount = await getAccount.execute(input.passengerId);
		// if (!account.is_passenger) throw new Error("Não é passageiro");
		// const ride: IRide = await getRide.execute(input.rideId);
		// if (ride) throw new Error("Já existe uma corrida em percurso para esse passageiro");
		await this.rideDAO.save(input);
		return {
			rideId: input.rideId,
		};
	}
}
import LoggerConsole from "./LoggerConsole";
import RideDAO from "./RideDAO";

export default class StartRide {

    constructor(private rideDAO: RideDAO, private logger: LoggerConsole) {
    }

    async execute(rideId: string): Promise<any> {
        this.logger.log(`startRide ${rideId}`);
        const ride = await this.rideDAO.getById(rideId);
        if (ride.status !== "accepted") throw new Error("Corrida inválida");
        await this.rideDAO.update(rideId, "in_progress");
        return {
            rideId
        }
    }
}
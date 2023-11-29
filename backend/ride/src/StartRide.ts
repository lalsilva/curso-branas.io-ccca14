import LoggerConsole from "./LoggerConsole";
import RideDAO from "./RideDAO";

export default class StartRide {

    constructor(private rideDAO: RideDAO, private logger: LoggerConsole) {
    }

    async execute(input: any): Promise<any> {
        this.logger.log(`startRide ${input.rideId}`);
        const ride = await this.rideDAO.getById(input.rideId);
        if (this.isInvalidRide(ride.status)) throw new Error("Corrida inválida");
        ride.status = "in_progress";
        await this.rideDAO.update(ride);
    }

    isInvalidRide(status: string) {
        return status !== "accepted";
    }
}
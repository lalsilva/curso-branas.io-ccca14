import LoggerConsole from "./LoggerConsole";
import RideDAO from "./RideRepository";

export default class StartRide {

    constructor(private rideDAO: RideDAO, private logger: LoggerConsole) {
    }

    async execute(input: Input): Promise<void> {
        this.logger.log(`startRide ${input.rideId}`);
        const ride = await this.rideDAO.getById(input.rideId);
        if (!ride) throw new Error("Essa corrida não existe");
        if (this.isInvalidRide(ride.getStatus())) throw new Error("Corrida inválida");
        ride.start();
        await this.rideDAO.update(ride);
    }

    isInvalidRide(status: string) {
        return status !== "accepted";
    }
}

type Input = {
    rideId: string;
}
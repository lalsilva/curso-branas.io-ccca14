import Logger from "./Logger";
import RideDAO from "./RideDAO";

export default class AcceptRide {

    constructor(private rideDAO: RideDAO, private logger: Logger) {
    }

    async execute(input: any): Promise<any> {
        this.logger.log(`accepRide`);
        const ride = await this.rideDAO.getById(input.rideId);
        if (this.isInvalidRide(ride.status)) throw new Error("Corrida inválida");
        const driver = await this.rideDAO.getByDriverId(input.driverId);
        if (this.isInvalidDriver(driver)) throw new Error("Motorista em outra corrida");
        input.status = 'accepted';
        await this.rideDAO.update(input.rideId, input.driverId, input.status);
        return {
            rideId: input.rideId,
        }
    }

    isInvalidRide(status: string) {
        return status !== "requested";
    }

    isInvalidDriver(driver: any) {
        return driver && (driver.status === "accepted" || driver.status === "in_progress");
    }
}
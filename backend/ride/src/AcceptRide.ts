import AccountDAO from "./AccountDAO";
import Logger from "./Logger";
import RideDAO from "./RideDAO";

export default class AcceptRide {

    constructor(private rideDAO: RideDAO, private accountDAO: AccountDAO, private logger: Logger) {
    }

    async execute(input: any): Promise<any> {
        this.logger.log(`accepRide ${input.rideId}`);
        const account = await this.accountDAO.getById(input.driverId);
        if (!account.is_driver) throw new Error("Somente motoristas podem aceitar uma corrida");
        const ride = await this.rideDAO.getById(input.rideId);
        if (this.isInvalidRide(ride.status)) throw new Error("Corrida inválida");
        const driver = await this.rideDAO.getByDriverId(input.driverId);
        if (driver && this.isInvalidDriver(driver.status)) throw new Error("Motorista em outra corrida");
        ride.status = 'accepted';
        ride.driverId = input.driverId;
        await this.rideDAO.update(ride);
        return {
            rideId: input.rideId,
        }
    }

    isInvalidRide(status: string) {
        return status !== "requested";
    }

    isInvalidDriver(status: string) {
        return status === "accepted" || status === "in_progress";
    }
}
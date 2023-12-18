import AccountDAO from "../repository/AccountRepository";
import Logger from "../logger/Logger";
import RideDAO from "../repository/RideRepository";

export default class AcceptRide {

    constructor(private rideDAO: RideDAO, private accountDAO: AccountDAO, private logger: Logger) {
    }

    async execute(input: any): Promise<any> {
        this.logger.log(`accepRide ${input.rideId}`);
        const account = await this.accountDAO.getById(input.driverId);
        if (!account) throw new Error("Essa conta não existe");
        if (!account.isDriver) throw new Error("Somente motoristas podem aceitar uma corrida");
        const ride = await this.rideDAO.getById(input.rideId);
        if (!ride) throw new Error("Essa corrida não existe");
        if (this.isInvalidRide(ride.getStatus())) throw new Error("Corrida inválida");
        const driver = await this.rideDAO.getByDriverId(input.driverId);
        if (driver && this.isInvalidDriver(driver.getStatus())) throw new Error("Motorista em outra corrida");
        ride.accept(input.driverId);
        await this.rideDAO.update(ride);
        return {
            rideId: ride.rideId,
        }
    }

    isInvalidRide(status: string) {
        return status !== "requested";
    }

    isInvalidDriver(status: string) {
        return status === "accepted" || status === "in_progress";
    }
}
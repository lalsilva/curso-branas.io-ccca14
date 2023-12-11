import Logger from "./Logger";
import RideDAO from "./RideRepositoryDatabase";

export default class GetRide {

    constructor(private rideDAO: RideDAO, private logger: Logger) {
    }

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideDAO.getById(rideId);
        if (!ride) throw new Error("Corrida não encontrada");
        return {
            rideId: ride.rideId,
            status: ride.getStatus(),
            driverId: ride.getDriverId(),
            passengerId: ride.passengerId
        };
    }
}

type Output = {
    rideId: string;
    status: string;
    driverId: string;
    passengerId: string;
}
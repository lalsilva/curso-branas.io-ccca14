import Ride from "../../domain/Ride";

export default interface RideRepository {
    save(ride: Ride): Promise<void>;
    getById(rideId: string): Promise<Ride | undefined>;
    getByDriverId(driverId: string): Promise<Ride | undefined>;
    getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>;
    list(): Promise<Ride[]>;
    update(ride: Ride): Promise<void>;
}
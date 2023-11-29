import { TRide } from './RequestRide';

export default interface RideDAO {
    save(ride: TRide): Promise<any>;
    getById(rideId: string): Promise<any>;
    getByDriverId(driverId: string): Promise<any>;
    getNotCompletedByPassengerId(passengerId: string): Promise<any>;
    update(rideId: string, driverId: string, status?: string): Promise<any>;
}
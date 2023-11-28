import { TRide } from './RequestRide';

export default interface RideDAO {
    save(ride: TRide): Promise<any>;
    getById(rideId: string): Promise<any>;
    getNotCompletedByPassengerId(passengerId: string): Promise<any>;
}
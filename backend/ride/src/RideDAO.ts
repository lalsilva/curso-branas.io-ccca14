import { TRide } from './RequestRide';

export default interface RideDAO {
    save(ride: TRide): Promise<any>;
    getById(rideId: string): Promise<any>;
    getByDriverId(driverId: string): Promise<any>;
    getActiveRideByPassengerId(passengerId: string): Promise<any>;
    update(ride: any): Promise<any>;
}
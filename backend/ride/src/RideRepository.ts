export default interface RideRepository {
    save(ride: any): Promise<any>;
    getById(rideId: string): Promise<any>;
    getByDriverId(driverId: string): Promise<any>;
    getActiveRideByPassengerId(passengerId: string): Promise<any>;
    update(ride: any): Promise<any>;
}
import pgp from 'pg-promise';
import Ride from '../../domain/Ride';
import RideRepository from '../../application/repository/RideRepository';

export default class RideRepositoryDatabase implements RideRepository {
    async save(ride: Ride): Promise<void> {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        await connection.query("INSERT INTO cccat14.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.getStatus(), ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
        await connection.$pool.end();
    }

    async getById(rideId: string): Promise<Ride | undefined> {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE ride_id = $1", [rideId]);
        await connection.$pool.end();
        if (!ride) return undefined;
        return new Ride(ride.ride_id, ride.passenger_id, ride.driver_id, ride.status, ride.date, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long));
    }

    async getByDriverId(driverId: string): Promise<Ride | undefined> {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE driver_id = $1", [driverId]);
        await connection.$pool.end();
        if (!ride) return undefined;
        return new Ride(ride.ride_id, ride.passenger_id, ride.driver_id, ride.status, ride.date, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long));
    }

    async getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined> {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE passenger_id = $1 AND status in ('requested', 'accepted', 'in_progress')", [passengerId]);
        await connection.$pool.end();
        if (!ride) return undefined;
        return new Ride(ride.ride_id, ride.passenger_id, ride.driver_id, ride.status, ride.date, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long));
    }

    async list(): Promise<Ride[]> {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const ridesData = await connection.query("SELECT * FROM cccat14.ride", []);
        await connection.$pool.end();
        const rides: Ride[] = [];
        for (const rideData of ridesData) {
            rides.push(new Ride(rideData.ride_id, rideData.passenger_id, rideData.driver_id, rideData.status, rideData.date, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long)));
        }
        return rides;
    }

    async update(ride: Ride): Promise<void> {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        await connection.query('UPDATE cccat14.ride SET  status = $1, driver_id = $2 WHERE ride_id = $3', [ride.getStatus(), ride.getDriverId(), ride.rideId]);
        await connection.$pool.end();
    }
}
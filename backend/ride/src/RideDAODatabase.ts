import pgp from 'pg-promise';
import { TRide } from './RequestRide';

export default class RideDAODatabase {
    async save(ride: TRide) {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        await connection.query("INSERT INTO cccat14.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.status, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
        await connection.$pool.end();
    }

    async getById(rideId: string) {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE ride_id = $1", [rideId]);
        await connection.$pool.end();
        return ride;
    }

    async getByDriverId(driverId: string) {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE driver_id = $1", [driverId]);
        await connection.$pool.end();
        return ride;
    }

    async getActiveRideByPassengerId(passengerId: string) {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const [ride] = await connection.query("SELECT * FROM cccat14.ride WHERE passenger_id = $1 AND status in ('requested', 'accepted', 'in_progress')", [passengerId]);
        await connection.$pool.end();
        return ride;
    }

    async update(rideId: string, status: string, driverId?: string) {
        const connection = pgp()("postgres://luizsilva:123456@localhost:5432/estudos");
        const [ride] = await connection.query(`UPDATE cccat14.ride SET ${driverId ? 'driver_id = $3,' : ''} status = $2 WHERE ride_id = $1`, [rideId, status, driverId]);
        await connection.$pool.end();
        return ride;
    }
}
import crypto from 'crypto';
import { validateCpf } from "./CpfValidator";

export default class Account {
    accountId: string;
    name: string;
    email: string;
    carPlate: string;
    cpf: string;
    isPassenger: boolean;
    isDriver: boolean;

    private constructor(accountId: string, name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
        if (this.isInvalidName(name)) throw new Error("Nome inválido");
        if (this.isInvalidEmail(email)) throw new Error("E-mail inválido");
        if (!validateCpf(cpf)) throw new Error("CPF inválido");
        if (isDriver && this.isInvalidCarPlate(carPlate)) throw new Error("Placa inválida");
        this.accountId = accountId;
        this.name = name;
        this.email = email;
        this.carPlate = carPlate;
        this.cpf = cpf;
        this.isPassenger = isPassenger;
        this.isDriver = isDriver;
    }

    static create(name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver);
    }

    static restore(accountId: string, name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
        return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver);
    }

    isInvalidName(name: string) {
        return !RegExp(/[a-zA-Z] [a-zA-Z]+/).exec(name);
    }

    isInvalidEmail(email: string) {
        return !RegExp(/^(.+)@(.+)$/).exec(email);
    }

    isInvalidCarPlate(carPlate: string) {
        return !RegExp(/[A-Z]{3}\d{4}/).exec(carPlate);
    }
}
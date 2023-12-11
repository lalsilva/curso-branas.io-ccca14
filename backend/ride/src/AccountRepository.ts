import GetAccountAccountRepository from "./GetAccountAccountRepository";
import SignupAccountRepository from "./SignupAccountRepository";

export default interface AccountRepository extends SignupAccountRepository, GetAccountAccountRepository {}
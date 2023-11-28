import GetAccountAccountDAO from "./GetAccountAccountDAO";
import SignupAccountDAO from "./SignupAccountDAO";

export default interface AccountDAO extends SignupAccountDAO, GetAccountAccountDAO {}
import Account from "../src/Account";

test("Deve criar uma conta", function () {
    const acccount = Account.create(
        "John Doe",
        "john.doe@gmail.com",
        "82537745086",
        "",
        true,
        false
    );
    expect(acccount.accountId).toBeDefined();
    expect(acccount.name).toBe("John Doe");
    expect(acccount.email).toBe("john.doe@gmail.com");
    expect(acccount.cpf).toBe("82537745086");
});
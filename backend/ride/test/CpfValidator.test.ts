import { validateCpf } from "../src/domain/CpfValidator";

test.each([
    "82537745086",
    "33478825040",
    "85718998000",
])("Deve testar cpfs válidos", function (cpf: string) {
    expect(validateCpf(cpf)).toBe(true);
});

test.each([
    "",
    undefined,
    null,
    "111",
    "111111111111",
    "11111111111"
])("Deve testar cpfs inválidos", function (cpf: any) {
    expect(validateCpf(cpf)).toBe(false);
});
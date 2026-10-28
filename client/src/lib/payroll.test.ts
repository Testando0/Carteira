import { describe, expect, it } from "vitest";
import { calculateSalary, calculateTermination } from "./payroll";

describe("calculateSalary", () => {
  it("calcula proporcional, bônus, desconto e líquido com centavos", () => {
    expect(calculateSalary(3000, 15, 250, 100)).toEqual({
      proportional: 1500,
      bonus: 250,
      gross: 1750,
      discount: 100,
      net: 1650,
    });
  });

  it("limita dias trabalhados a 30 e nunca gera líquido negativo", () => {
    expect(calculateSalary(1000, 45, 0, 2000).net).toBe(0);
    expect(calculateSalary(1000, 45, 0, 0).proportional).toBe(1000);
  });
});

describe("calculateTermination", () => {
  it("usa meses-calendário e não a diferença fixa de 30 dias", () => {
    const result = calculateTermination(3000, "2026-01-01", "2026-02-20", 0);
    expect(result.salaryBalance).toBe(2000);
    expect(result.vacationProportional).toBe(500);
    expect(result.thirteenthProportional).toBe(500);
    expect(result.fgtsFine).toBe(192);
    expect(result.netTerminationAmount).toBe(3192);
  });

  it("aceita admissão exibida em pt-BR e aplica desconto sem valor negativo", () => {
    const result = calculateTermination(1800, "15/01/2026", "14/02/2026", 5000);
    expect(result.salaryBalance).toBe(840);
    expect(result.netTerminationAmount).toBe(0);
  });
});

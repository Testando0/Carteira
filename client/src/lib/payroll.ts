export type SalaryCalculation = {
  proportional: number;
  bonus: number;
  gross: number;
  discount: number;
  net: number;
};

export type TerminationCalculation = {
  salaryBalance: number;
  vacationProportional: number;
  thirteenthProportional: number;
  fgtsFine: number;
  terminationDiscounts: number;
  netTerminationAmount: number;
};

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const nonNegative = (value: number) => Math.max(0, Number.isFinite(value) ? value : 0);

export function calculateSalary(
  salary: number,
  workedDays: number,
  bonus: number,
  discount: number,
): SalaryCalculation {
  const monthlySalary = nonNegative(Number(salary));
  const days = Math.min(30, nonNegative(Number(workedDays)));
  const extra = nonNegative(Number(bonus));
  const deductions = nonNegative(Number(discount));
  const proportional = roundMoney((monthlySalary / 30) * days);
  const gross = roundMoney(proportional + extra);
  const net = roundMoney(Math.max(0, gross - deductions));
  return { proportional, bonus: roundMoney(extra), gross, discount: roundMoney(deductions), net };
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const date = match
    ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), 12)
    : new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function calculateTermination(
  salary: number,
  admitted: string,
  terminationDate: string,
  discount: number,
): TerminationCalculation {
  const monthlySalary = nonNegative(Number(salary));
  const end = parseDate(terminationDate) || new Date();
  const start = parseDate(admitted) || end;
  const monthDifference = Math.max(
    0,
    (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth(),
  );
  // Regra do servidor: mês com 15 dias ou mais entra na proporcional, limitada a 12 meses.
  const proportionalMonths = Math.min(12, Math.max(1, monthDifference + (end.getDate() >= 15 ? 1 : 0)));
  const salaryBalance = roundMoney((monthlySalary / 30) * Math.min(30, Math.max(0, end.getDate())));
  const vacationProportional = roundMoney((monthlySalary / 12) * proportionalMonths);
  const thirteenthProportional = roundMoney((monthlySalary / 12) * proportionalMonths);
  const fgtsFine = roundMoney(monthlySalary * 0.08 * proportionalMonths * 0.4);
  const terminationDiscounts = roundMoney(nonNegative(Number(discount)));
  const netTerminationAmount = roundMoney(
    Math.max(0, salaryBalance + vacationProportional + thirteenthProportional + fgtsFine - terminationDiscounts),
  );
  return {
    salaryBalance,
    vacationProportional,
    thirteenthProportional,
    fgtsFine,
    terminationDiscounts,
    netTerminationAmount,
  };
}

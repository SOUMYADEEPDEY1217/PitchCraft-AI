import { describe, it, expect } from 'vitest';

export interface PricingCalculatorInputs {
  billingModel: 'hourly' | 'fixed_value' | 'retainer';
  estimatedHours: number;
  baseHourlyRate: number;
  fixedProjectFee: number;
  monthlyRetainerFee: number;
  retainerMonths: number;
  bufferPercent: number; // e.g. 15%
  profitMarginPercent: number; // e.g. 20%
  taxRatePercent: number; // e.g. 8.25%
}

export function calculateProjectPricing(inputs: PricingCalculatorInputs) {
  let subtotal = 0;

  if (inputs.billingModel === 'hourly') {
    subtotal = inputs.estimatedHours * inputs.baseHourlyRate;
  } else if (inputs.billingModel === 'fixed_value') {
    subtotal = inputs.fixedProjectFee;
  } else if (inputs.billingModel === 'retainer') {
    subtotal = inputs.monthlyRetainerFee * inputs.retainerMonths;
  }

  const contingencyAmount = (subtotal * inputs.bufferPercent) / 100;
  const afterBuffer = subtotal + contingencyAmount;

  const profitMarginAmount = (afterBuffer * inputs.profitMarginPercent) / 100;
  const netBeforeTax = afterBuffer + profitMarginAmount;

  const taxAmount = (netBeforeTax * inputs.taxRatePercent) / 100;
  const finalTotal = Math.round((netBeforeTax + taxAmount) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    contingencyAmount: Math.round(contingencyAmount * 100) / 100,
    afterBuffer: Math.round(afterBuffer * 100) / 100,
    profitMarginAmount: Math.round(profitMarginAmount * 100) / 100,
    netBeforeTax: Math.round(netBeforeTax * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    finalTotal,
  };
}

describe('PitchCraft AI - Smart Pricing Engine', () => {
  it('calculates deterministic hourly model pricing accurately', () => {
    const inputs: PricingCalculatorInputs = {
      billingModel: 'hourly',
      estimatedHours: 80,
      baseHourlyRate: 150,
      fixedProjectFee: 0,
      monthlyRetainerFee: 0,
      retainerMonths: 1,
      bufferPercent: 10, // 10% contingency
      profitMarginPercent: 20, // 20% profit margin
      taxRatePercent: 0,
    };

    const result = calculateProjectPricing(inputs);
    expect(result.subtotal).toBe(12000);
    expect(result.contingencyAmount).toBe(1200);
    expect(result.afterBuffer).toBe(13200);
    expect(result.profitMarginAmount).toBe(2640);
    expect(result.finalTotal).toBe(15840);
  });

  it('calculates fixed value fee with buffer and tax correctly', () => {
    const inputs: PricingCalculatorInputs = {
      billingModel: 'fixed_value',
      estimatedHours: 0,
      baseHourlyRate: 0,
      fixedProjectFee: 20000,
      monthlyRetainerFee: 0,
      retainerMonths: 1,
      bufferPercent: 15,
      profitMarginPercent: 10,
      taxRatePercent: 8,
    };

    const result = calculateProjectPricing(inputs);
    // Subtotal: 20,000
    expect(result.subtotal).toBe(20000);
    // Contingency: 15% of 20000 = 3000 -> 23000
    expect(result.contingencyAmount).toBe(3000);
    expect(result.afterBuffer).toBe(23000);
    // Margin: 10% of 23000 = 2300 -> 25300
    expect(result.profitMarginAmount).toBe(2300);
    expect(result.netBeforeTax).toBe(25300);
    // Tax: 8% of 25300 = 2024
    expect(result.taxAmount).toBe(2024);
    // Total: 27324
    expect(result.finalTotal).toBe(27324);
  });

  it('calculates recurring retainer pricing correctly across multi-month contracts', () => {
    const inputs: PricingCalculatorInputs = {
      billingModel: 'retainer',
      estimatedHours: 0,
      baseHourlyRate: 0,
      fixedProjectFee: 0,
      monthlyRetainerFee: 4500,
      retainerMonths: 6,
      bufferPercent: 0,
      profitMarginPercent: 0,
      taxRatePercent: 0,
    };

    const result = calculateProjectPricing(inputs);
    expect(result.subtotal).toBe(27000);
    expect(result.finalTotal).toBe(27000);
  });

  it('handles zero inputs gracefully without NaN', () => {
    const inputs: PricingCalculatorInputs = {
      billingModel: 'hourly',
      estimatedHours: 0,
      baseHourlyRate: 0,
      fixedProjectFee: 0,
      monthlyRetainerFee: 0,
      retainerMonths: 0,
      bufferPercent: 0,
      profitMarginPercent: 0,
      taxRatePercent: 0,
    };

    const result = calculateProjectPricing(inputs);
    expect(result.subtotal).toBe(0);
    expect(result.finalTotal).toBe(0);
    expect(isNaN(result.finalTotal)).toBe(false);
  });
});

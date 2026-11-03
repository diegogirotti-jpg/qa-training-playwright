import { test, expect } from '@playwright/test';
import { classify, measurePrices, type Observation } from '../model';
const observed = { complete: true, reproduced: true } as Observation;
test('no confunde red, timeout o falta de evidencia con un bug', () => {
  expect(classify(undefined, 'failed')).toBe('INCONCLUSO');
  expect(classify({ ...observed, complete: false }, 'failed')).toBe('INCONCLUSO');
  expect(classify(observed, 'timedOut')).toBe('INCONCLUSO');
});
test('solo confirma el hallazgo medido y una aserción fallida', () => {
  expect(classify(observed, 'failed')).toBe('HALLAZGO_REPRODUCIDO');
  expect(classify(observed, 'passed')).toBe('INCONCLUSO');
  expect(classify({ ...observed, reproduced: false }, 'passed')).toBe('SIN_HALLAZGO');
});
const products = (...prices: string[]) => prices.map(price => ({ price, name: 'test', href: null }));
test('mide pares fuera de orden y admite importes iguales', () => {
  expect(measurePrices(products('$1.10', '$1.10', '$2.20')).violations).toBe(0);
  expect(measurePrices(products('$3.00', '$2.00', '$1.00')).violations).toBe(2);
});
test('no interpreta una lista vacía o importes inválidos como orden correcto', () => {
  expect(measurePrices([]).valid).toBe(false);
  expect(measurePrices(products('$1.00')).valid).toBe(false);
  expect(measurePrices(products('unknown', '$2.00')).valid).toBe(false);
});

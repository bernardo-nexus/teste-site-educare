import { describe, expect, it } from 'vitest';

import { maskCNPJ, maskDate, maskPhone } from '../utils/masks';

describe('maskCNPJ', () => {
  it('formats a full CNPJ', () => {
    expect(maskCNPJ('12345678000195')).toBe('12.345.678/0001-95');
  });

  it('formats partial CNPJ values', () => {
    expect(maskCNPJ('12')).toBe('12');
    expect(maskCNPJ('1234')).toBe('12.34');
    expect(maskCNPJ('12345678')).toBe('12.345.678');
    expect(maskCNPJ('123456780001')).toBe('12.345.678/0001');
  });

  it('strips non-digit characters', () => {
    expect(maskCNPJ('12.345.678/0001-95')).toBe('12.345.678/0001-95');
    expect(maskCNPJ('12 345 678 0001 95')).toBe('12.345.678/0001-95');
  });
});

describe('maskPhone', () => {
  it('formats mobile and landline numbers', () => {
    expect(maskPhone('11987654321')).toBe('(11) 98765-4321');
    expect(maskPhone('1133334444')).toBe('(11) 3333-4444');
  });

  it('formats partial phone values', () => {
    expect(maskPhone('11')).toBe('(11');
    expect(maskPhone('119876')).toBe('(11) 9876');
    expect(maskPhone('11987654')).toBe('(11) 9876-54');
  });
});

describe('maskDate', () => {
  it('formats a full date', () => {
    expect(maskDate('15032024')).toBe('15/03/2024');
  });

  it('formats partial date values', () => {
    expect(maskDate('15')).toBe('15');
    expect(maskDate('1503')).toBe('15/03');
    expect(maskDate('150320')).toBe('15/03/20');
  });
});

import { describe, expect, it } from 'vitest';

import { adminSchema, schoolSchema } from '../utils/schemas';

const validSchool = {
  schoolName: 'Escola Infantil Arco-Íris',
  schoolRazaoSocial: 'Escola Infantil Arco-Íris LTDA',
  schoolCnpj: '12.345.678/0001-99',
  schoolEmail: 'contato@escola.com.br',
  schoolPhone: '(11) 99999-9999',
  schoolFoundationDate: '01/01/2010',
};

const validAdmin = {
  adminName: 'Maria Silva',
  adminEmail: 'maria@escola.com',
  adminPhone: '(11) 98765-4321',
  adminGender: 'female',
};

describe('schoolSchema', () => {
  it('accepts valid school data', () => {
    expect(schoolSchema.safeParse(validSchool).success).toBe(true);
  });

  it('requires school name', () => {
    expect(
      schoolSchema.safeParse({ ...validSchool, schoolName: '' }).success,
    ).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = schoolSchema.safeParse({
      ...validSchool,
      schoolEmail: 'invalid-email',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === 'invalidEmail')).toBe(true);
    }
  });

  it('rejects empty CNPJ', () => {
    expect(
      schoolSchema.safeParse({ ...validSchool, schoolCnpj: '' }).success,
    ).toBe(false);
  });

  it('rejects invalid foundation date format', () => {
    expect(
      schoolSchema.safeParse({ ...validSchool, schoolFoundationDate: '2024-01-15' }).success,
    ).toBe(false);
  });
});

describe('adminSchema', () => {
  it('accepts valid admin data', () => {
    expect(adminSchema.safeParse(validAdmin).success).toBe(true);
  });

  it('requires admin name and email', () => {
    expect(adminSchema.safeParse({ ...validAdmin, adminName: '' }).success).toBe(false);
    expect(adminSchema.safeParse({ ...validAdmin, adminEmail: '' }).success).toBe(false);
  });

  it('requires phone and gender', () => {
    expect(adminSchema.safeParse({ ...validAdmin, adminPhone: '' }).success).toBe(false);
    expect(adminSchema.safeParse({ ...validAdmin, adminGender: '' }).success).toBe(false);
  });
});

import { z } from 'zod';

export const schoolSchema = z.object({
  schoolName: z.string().min(1, 'required'),
  schoolRazaoSocial: z.string().min(1, 'required'),
  schoolCnpj: z.string().min(1, 'required').refine(
    (val) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val),
    { message: 'invalidCnpj' }
  ),
  schoolEmail: z.string().min(1, 'required').email('invalidEmail'),
  schoolPhone: z.string().min(1, 'required'),
  schoolFoundationDate: z.string().min(1, 'required').refine(
    (val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val),
    { message: 'invalidDate' }
  ),
});

export const adminSchema = z.object({
  adminName: z.string().min(1, 'required'),
  adminEmail: z.string().min(1, 'required').email('invalidEmail'),
  adminPhone: z.string().min(1, 'required'),
  adminGender: z.string().min(1, 'required'),
});

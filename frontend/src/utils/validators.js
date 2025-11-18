import { z } from 'zod';

export const BookingSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Provide a valid email'),
  phone: z.string().min(7, 'Provide a valid phone number').optional().or(z.literal('')),
  classType: z.string().min(1, 'Select a class'),
  date: z.string().min(1, 'Select a date'),
  message: z.string().max(500, 'Message too long').optional().or(z.literal('')),
});

export const ContactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Provide a valid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Please provide more details'),
});

// PUBLIC_INTERFACE
export function parseZod(schema, data) {
  /** Helper to parse with zod and return { values, errors } */
  const result = schema.safeParse(data);
  if (result.success) return { values: result.data, errors: {} };
  const errors = {};
  for (const iss of result.error.issues) {
    const key = iss.path.join('.') || '_';
    errors[key] = iss.message;
  }
  return { values: null, errors };
}

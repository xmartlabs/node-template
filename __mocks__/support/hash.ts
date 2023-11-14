import { OTP } from '@prisma/client';

export const createStubHash = (opts?: Partial<OTP>): OTP => ({
  createdAt: new Date('2025-01-01'),
  expiresAt: new Date('2025-01-01T00:15:00.000Z'),
  code: 'hash',
  id: 1,
  updatedAt: new Date('2025-01-01'),
  userId: '1',
  ...opts,
});

import { Hash } from '@prisma/client';

export const createStubHash = (opts?: Partial<Hash>): Hash => ({
  createdAt: new Date('2025-01-01'),
  expiresAt: new Date('2025-01-01T00:15:00.000Z'),
  hash: 'hash',
  id: 1,
  updatedAt: new Date('2025-01-01'),
  userId: '1',
  ...opts,
});

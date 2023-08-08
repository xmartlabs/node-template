import { Hash } from '@prisma/client';

import { HashTypes } from 'types/hash';

export const createStubHash = (opts?: Partial<Hash>): Hash => ({
  createdAt: new Date('2022-01-01'),
  expiresAt: new Date('2022-01-01T00:15:00.000Z'),
  hash: 'hash',
  id: 1,
  sentTo: 'example@xmartlabs.com',
  type: HashTypes.RESET_PASSWORD,
  updatedAt: new Date('2022-01-01'),
  userId: '1',
  ...opts,
});

import { Prisma, PrismaClient } from '@prisma/client';

import { QueryPromise, QueryPromiseType } from '../types';
import { DatabaseError } from '../errors';

export class Base {
  protected static prisma = new PrismaClient({ rejectOnNotFound: true });

  static dbConnectionWrapper = async (queryPromise : QueryPromise<QueryPromiseType>) => {
    try {
      return await queryPromise.finally(async () => {
        await Base.prisma.$disconnect();
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        throw new DatabaseError(e.message, e.meta || {});
      }
      throw e;
    }
  };
}

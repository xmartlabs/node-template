import { User, PrismaPromise } from '@prisma/client';

export type QueryPromise<Type> = PrismaPromise<Type> | PrismaPromise<Type[]>;

export type QueryPromiseType = User;

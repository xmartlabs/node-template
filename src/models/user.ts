import { Prisma } from '@prisma/client';

import { Base } from './base';

export class User extends Base {
  static find = (id: number) : any => User.dbConnectionWrapper(
    User.prisma.user.findUnique({ where: { id } }),
  );

  static all = () : any => User.dbConnectionWrapper(
    User.prisma.user.findMany(),
  );

  static create = (userData: Prisma.UserCreateInput) : any => User.dbConnectionWrapper(
    User.prisma.user.create({ data: userData }),
  );

  static update = (id: number, userData: Prisma.UserUpdateInput) : any => User.dbConnectionWrapper(
    User.prisma.user.update({ where: { id }, data: userData }),
  );

  static destroy = (id: number) : any => User.dbConnectionWrapper(
    User.prisma.user.delete({ where: { id } }),
  );
}

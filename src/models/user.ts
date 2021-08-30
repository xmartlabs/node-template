// TODO: Remove all this code when adding database management

const users = [
  {
    id: 1,
    firstname: 'A',
    lastname: 'B',
    email: 'ab@example.com',
  },
  {
    id: 2,
    firstname: 'C',
    lastname: 'D',
    email: 'cd@example.com',
  },
  {
    id: 3,
    firstname: 'E',
    lastname: 'F',
    email: 'ef@example.com',
  },
  {
    id: 4,
    firstname: 'G',
    lastname: 'H',
    email: 'gh@example.com',
  },
  {
    id: 5,
    firstname: 'I',
    lastname: 'J',
    email: 'ij@example.com',
  },
  {
    id: 6,
    firstname: 'K',
    lastname: 'L',
    email: 'kl@example.com',
  },
];

export class User {
  static find = (id : string) : any => (
    users.find((u : any) => String(u.id) === id)
  );

  static all = () : any => users;

  static create = (newUser : any) : any => {
    users[users.length] = newUser;

    return newUser;
  }

  static update = (id : string, userData : any) : any => {
    const indexToUpdate = users.findIndex(
      (u : any) => String(u.id) === id
    );

    if (indexToUpdate < 0) {
      return null;
    }
  
    users[indexToUpdate] = userData;

    return userData;
  }

  static destroy = (id : string) : any => {
    const indexToDelete = users.findIndex(
      (u : any) => String(u.id) === id
    );

    if (indexToDelete < 0) {
      return null;
    }

    return users.splice(indexToDelete, 1);
  }
}

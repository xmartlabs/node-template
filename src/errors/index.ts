export class DatabaseError extends Error {
  public details: object;

  constructor(message: string, details: object) {
    super(message);

    this.name = 'DatabaseError';
    this.details = details;
  }
}

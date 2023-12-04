import RedisMock from 'ioredis-mock';

jest.mock('ioredis', () => RedisMock);

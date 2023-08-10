import { randomBytes } from 'crypto';

const DEFAULT_CODE_LENGTH = 6;

const cryptoRandomNumber = (length: number) => randomBytes(length).readUIntBE(0, length);

export const generateCode = (length = DEFAULT_CODE_LENGTH) => {
  const highestCode = 10 ** length - 1;
  const bytesLength = Buffer.byteLength(highestCode.toString());
  const randomNumber = cryptoRandomNumber(bytesLength);

  return String(
    Math.floor((randomNumber * highestCode) / 2 ** (8 * bytesLength)),
  ).padStart(length, '0');
};

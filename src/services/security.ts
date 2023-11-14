import { randomBytes } from 'crypto';

const DEFAULT_CODE_LENGTH = 6;

const generateCode = (length = DEFAULT_CODE_LENGTH) => {
  let code = '';
  while (code.length < length) {
    const randomDigit = randomBytes(1).readUInt8(0) % 10;
    code += randomDigit.toString();
  }
  return code;
};

export { generateCode };

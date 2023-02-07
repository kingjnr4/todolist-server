import bcrypt from 'bcrypt'
import { JWT_EXPIRES_IN, JWT_SECRET, SECRET_KEY } from '../config';
import jwt from 'jsonwebtoken';
import { logger } from './logger';
/**
 * It replaces all instances of a lowercase letter followed by an uppercase letter with the lowercase
 * letter followed by a space followed by the uppercase letter
 * @param {string} str - The string to convert to camel case.
 */

export function toCamelCase(str:string) {
  return str.replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + m[1].toUpperCase();
  }).replace(/_|\s/g, "");
}
  
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password,10);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}


export  function signJwt(payload: string | object | Buffer) {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
  } catch (e) {
    throw new Error('Internal Server Error')
  }
}



export  function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {id:string};
  } catch (e) {
    logger.error(e)
    return null
  }
}

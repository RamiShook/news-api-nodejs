import * as bcrypt from 'bcrypt';
export function encryptPassword(rawPassword: string) {
  return bcrypt.hashSync(rawPassword, 10);
}

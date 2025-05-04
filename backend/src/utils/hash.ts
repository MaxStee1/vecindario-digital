import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, 10);
  } catch {
    throw new Error('Error al encriptar la contraseña');
  }
}

export async function comparePasswords(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return bcrypt.compare(password, hash);
  } catch {
    throw new Error('Error al comparar las contraseñas');
  }
}

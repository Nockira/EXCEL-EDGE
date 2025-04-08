import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const isPasswordMatch = (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

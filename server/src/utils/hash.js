
import bcrypt from "bcryptjs";
const hashPassword = async (_plainPassword) => {
  const hashedPassword = await bcrypt.hash(_plainPassword, 10);
  return hashedPassword;  
  
};

const comparePassword = async (_plainPassword, _passwordHash) => {
  const isMatch = await bcrypt.compare(_plainPassword, _passwordHash);
  return isMatch;
}

export { hashPassword, comparePassword };

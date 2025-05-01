import bcrypt from "bcrypt";
class Hash {
  saltRounds = 10; // Number of salt rounds for bcrypt
  createHash(password: string) {
    // Hash the password
    return bcrypt.hash(password, this.saltRounds);
  }

  compareHash(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export default new Hash();

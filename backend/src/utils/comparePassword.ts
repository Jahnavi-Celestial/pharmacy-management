import bcrypt from 'bcrypt';

export const comparePassword = async(password: string, hasedPassword: string) => {
    return await bcrypt.compare(password, hasedPassword);
};
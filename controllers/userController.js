import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log('achieved');
      return res.status(404).json({ message: "User doesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      'privateString',
      { expiresIn: '5s' }
    );
    const result = {
      id: existingUser._id,
      email: existingUser.email,
      name: existingUser.name,
    };
    return res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password don't match." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists.' });
    const hasedPassword = await bcrypt.hash(password, 12);
    const createdResult = await User.create({
      email,
      password: hasedPassword,
      name: `${firstName} ${lastName}`,
    });
    const result = {
      id: createdResult._id,
      email: createdResult.email,
      name: createdResult.name,
    };
    const token = jwt.sign(
      { email: result.email, id: result._id },
      'privateString',
      { expiresIn: '1h' }
    );
    console.log(token);
    return res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

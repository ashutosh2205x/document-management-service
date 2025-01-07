import { User } from "../models/user.model";
import BloomFilter from "./bloomFilter.util";

const bloomFilter = new BloomFilter(10000, 3);

export const populateBloomFilter = async () => {
  const users = await User.findAll({ attributes: ["email"] });
  users.forEach((user) => {
    bloomFilter.add(user.dataValues.email);
  });
};

export const isEmailInFilter = (email: string): boolean => bloomFilter.has(email);
export const addEmailToFilter = (email: string): void => bloomFilter.add(email);

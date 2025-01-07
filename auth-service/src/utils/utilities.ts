import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { z } from "zod";

export const ROLES = ["admin", "editor", "viewer"];

export const PERMISSIONS = ["create", "read", "update", "delete"];

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export class BloomFilter {
  private size: number;
  private bitArray: number[];
  private hashFunctions: ((item: string) => number)[];

  constructor(size: number, numHashFunctions: number) {
    this.size = size;
    this.bitArray = Array(size).fill(0);
    this.hashFunctions = this.createHashFunctions(numHashFunctions);
  }

  add(item: string): void {
    console.log("adding item", item);
    this.hashFunctions.forEach((hashFunction) => {
      const index = hashFunction(item) % this.size;
      this.bitArray[index] = 1;
    });
  }

  has(item: string): boolean {
    return this.hashFunctions.every((hashFunction) => {
      const index = hashFunction(item) % this.size;
      return this.bitArray[index] === 1;
    });
  }

  private createHashFunctions(numHashFunctions: number): ((item: string) => number)[] {
    const hashFunctions: ((item: string) => number)[] = [];
    for (let i = 0; i < numHashFunctions; i++) {
      hashFunctions.push((item: string) => {
        let hash = 0;
        for (let j = 0; j < item.length; j++) {
          hash = (hash << 5) + item.charCodeAt(j) + i; // Simple hash function
          hash = hash & hash; // 32-bit integer
        }
        return Math.abs(hash);
      });
    }
    return hashFunctions;
  }
}

const bloomFilter = new BloomFilter(10000, 3);

export const populateBloomFilter = async () => {
  const users = await User.findAll({ attributes: ["email"] });
  users.forEach((user) => {
    bloomFilter.add(user.dataValues.email);
  });
};

export const isEmailInFilter = (email: string): boolean => bloomFilter.has(email);
export const addEmailToFilter = (email: string): void => bloomFilter.add(email);

export const IUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class HashService {
  hash = async (data: string) => {
    const salt = await genSalt();
    return hash(data, salt);
  };

  /**
   * Returns true if the data matches the hashedData, false otherwise
   */
  compareHash = async (data: string, hashedData: string) => {
    return compare(data, hashedData);
  };
}

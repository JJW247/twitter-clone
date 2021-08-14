import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommonService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async checkPassword(password, hashPassword): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}

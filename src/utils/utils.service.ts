/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Utils {
  constructor(private jwtService: JwtService) {}
  encryptData(data: string): string {
    try {
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(process.env.SECRET_KEY, 'hex'),
        Buffer.from(process.env.IV_KEY, 'hex'),
      );
      let encryptedData = cipher.update(data);
      encryptedData = Buffer.concat([encryptedData, cipher.final()]);
      return encryptedData.toString('hex');
    } catch (error) {
      Logger.error(`Error encrypting data: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  decryptData(data: string): string {
    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(process.env.SECRET_KEY, 'hex'),
        Buffer.from(process.env.IV_KEY, 'hex'),
      );
      let decryptedData = decipher.update(Buffer.from(data, 'hex'));
      decryptedData = Buffer.concat([decryptedData, decipher.final()]);
      return decryptedData.toString();
    } catch (error) {
      Logger.error(`Error decrypting data: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      Logger.error(`Error generating password hash: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
  async comparePasswordHash(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      Logger.error(`Error comparing password hashes: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  signPayload(payload: any): string {
    try {
      const token = this.jwtService.sign(payload, {
        expiresIn: 3600,
        secret: process.env.JWT_SECRET,
      });
      return token;
    } catch (error) {
      Logger.error(`Error generating access token: ${error.message}`);
      throw new Error(error.message);
    }
  }

  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  genKeys() {
    const key = crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16).toString('hex');
    return {
      key,
      iv,
    };
  }
}

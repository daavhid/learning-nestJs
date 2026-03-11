import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userModel.findOne({ email: signUpDto.email });

    if (user) {
      throw new ConflictException('email already exists');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const newUser = new this.userModel({
      ...signUpDto,
      password: hashedPassword,
    });

    // generate JWTs
    const accessToken = await this.generateAccessToken(newUser);
    await newUser.save();
    return { accessToken };
  }

  async signIn(signInDto: SignInDto) {
    const existingUser = await this.findOne({ email: signInDto.email });
    if (
      !existingUser ||
      !(await this.validate(signInDto.password, existingUser.password))
    ) {
      throw new BadRequestException('Invalid credentials provided');
    }

    const accessToken = await this.generateAccessToken(existingUser);
    return {
      accessToken,
    };
  }

  async getAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(identifier: Record<string, string>) {
    const user = await this.userModel.findOne(identifier);
    if (!user) {
      throw new ForbiddenException('user does not exist');
    }
    return user;
  }

  private async generateAccessToken(user: UserDocument): Promise<string> {
    const payload = {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: await this.configService.get('JWT_SECRET_ACCESS_TOKEN'),
      expiresIn: await this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });

    return accessToken;
  }

  private async validate(password: string, encryptedPassword: string) {
    return await bcrypt.compare(password, encryptedPassword);
  }
}

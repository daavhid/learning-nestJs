import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel:Model<User>,
  private jwtService:JwtService,private configService:ConfigService){}
  async create(SignUpDto: SignUpDto) {
    const user = await this.userModel.findOne({email:SignUpDto.email})

    if(user){
      throw new ConflictException('email already exists')
    }
    const hashedPassowrd = await bcrypt.hash(SignUpDto.password,10)

    const newUser = new  this.userModel({
      ...SignUpDto,
      password:hashedPassowrd
    })

    //generate jwts
      const accessToken = await this.generateAccessToken(newUser)
      await newUser.save()
      return {accessToken}

  }

  async getall() {
    const users = await this.userModel.find()
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private async generateAccessToken(user:UserDocument): Promise<string>{
    const payload = {
      sub:user._id.toString(),
      name:user.name,
      email:user.email
    }

    const accessToken = await this.jwtService.signAsync(payload,{
      secret: await this.configService.get('JWT_SECRET_ACCESS_TOKEN'),
      expiresIn:await this.configService.get('JWT_ACCESS_EXPIRES_IN')

    })
    console.log(accessToken,this.configService.get('JWT_SECRET_ACCESS_TOKEN'))

    return accessToken

  }
}

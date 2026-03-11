import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction } from './schemas/reaction.schema';
import { Model } from 'mongoose';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    private readonly notificationService: NotificationService,
  ) {}

  async addReaction({ type, postId }: CreateReactionDto, userId: string) {
    const newReaction = await this.reactionModel.create({
      post: postId,
      type,
      user: userId,
    });
    return newReaction;
  }

  async getPostReactions(postId: string) {
    const reactions = await this.reactionModel
      .find({
        post: postId,
      })
      .populate('user');
    return reactions;
  }

  async findExistingReaction(postId: string, userId: string) {
    const existingReaction = await this.reactionModel.findOne({
      post: postId,
      user: userId,
    });

    if (!existingReaction) return null;

    return existingReaction;
  }

  async updateReaction({ type, postId }: CreateReactionDto, userId: string) {
    const reaction = await this.reactionModel.findOneAndUpdate(
      {
        user: userId,
        post: postId,
      },
      { type },
      { new: true },
    );

    return reaction;
  }

  async removeReaction(postId: string, userId: string) {
    await this.reactionModel.findOneAndDelete({
      post: postId,
      user: userId,
    });
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Transform } from 'class-transformer';
import { Mediatype } from 'src/posts/Schema/post.schema';
import { UserDocument } from 'src/users/schemas/user.schema';

export const ObjectId = (prop?: string) => {
  if (prop) {
    return Transform(({ obj }) => obj[prop]?._id?.toString() ?? null);
  }

  return Transform(({ obj }) => obj._id?.toString() ?? null);
};

export const TransformUserObjectToString = <T>(
  propName: string,
  nestedField?: T,
) => {
  switch (propName) {
    case 'seenBy':
      return Transform(({ obj }) => {
        return obj[propName].map((user: UserDocument) => ({
          _id: user._id,
          name: user.name,

          avatarUrl: obj?.avatar
            ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.avatar.resource_type}/upload/v${obj.avatar.version}/${obj.avatar.public_id}.${obj.avatar.format}`
            : '',
        }));
      });
    default:
      switch (nestedField) {
        case '_id':
          return Transform(({ obj }) => {
            return obj?.[propName]?.[nestedField]
              ? obj[propName][nestedField]?._id?.toString()
              : null;
          });
        case 'avatar':
          return Transform(({ obj }) =>
            obj[propName]?.avatar
              ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj[propName]?.avatar.resource_type}/upload/v${obj[propName]?.avatar.version}/${obj[propName]?.avatar.public_id}.${obj[propName]?.avatar.format}`
              : '',
          );
        default:
          return Transform(({ obj }) => obj?.[propName]?.[nestedField] ?? null);
      }
  }
};

export const TransformMediaFilesObject = (type: 'mediaFile' | 'mediaFiles') => {
  switch (type) {
    case 'mediaFiles':
      return Transform(({ obj }) => {
        return obj[type]?.map(
          (mediaFile: Mediatype) =>
            `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${mediaFile.resource_type}/upload/v${mediaFile.version}/${mediaFile.public_id}.${mediaFile.format}`,
        );
      });
    default:
      return Transform(
        ({ obj }) =>
          `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj[type].resource_type}/upload/v${obj[type].version}/${obj[type].public_id}.${obj[type].format}`,
      );
  }
};

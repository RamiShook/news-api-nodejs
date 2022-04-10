import { Exclude } from 'class-transformer';

export class SerializedUser {
  id;

  name: string;

  username: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

import { UserInterface } from "../../domain/interface/User";
import { User } from "../../domain/entities/User";
import UserModel from "../database/userSchema";

export class UserRepository implements UserInterface {
  public async create(user: User): Promise<User> {
    const userDoc = new UserModel(user);
    await userDoc.save();
    return userDoc.toObject(); // returning plain object
  }

  public async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email }).exec();
    return userDoc ? userDoc.toObject() : null;
  }

  public async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id).exec();
    return userDoc ? userDoc.toObject() : null;
  }

  public async update(id: string, user: User): Promise<User | null> {
    const userDoc = await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    }).exec();
    return userDoc ? userDoc.toObject() : null;
  }

  public async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id).exec();
  }
}

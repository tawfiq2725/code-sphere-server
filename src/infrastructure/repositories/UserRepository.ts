import { UserInterface } from "../../domain/interface/User";
import { Person } from "../../domain/entities/User";
import UserModel, { UserDocument } from "../database/userSchema";

export class UserRepository implements UserInterface {
  private maptoEntity(userDoc: UserDocument): Person {
    return new Person(
      userDoc.name,
      userDoc.email,
      userDoc.password,
      userDoc.role,
      userDoc.isVerified,
      userDoc.isAdmin,
      userDoc.googleId
    );
  }

  public async create(user: Person): Promise<Person> {
    const userDoc = new UserModel(user);
    await userDoc.save();
    return this.maptoEntity(userDoc);
  }

  public async findByEmail(email: string): Promise<Person | null> {
    const userDoc = await UserModel.findOne({ email }).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }

  public async findById(id: string): Promise<Person | null> {
    const userDoc = await UserModel.findById(id).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }

  public async update(
    id: string,
    user: Partial<Person>
  ): Promise<Person | null> {
    const userDoc = await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    }).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }
}

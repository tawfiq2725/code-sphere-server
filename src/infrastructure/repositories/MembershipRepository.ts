import { Membership } from "../../domain/entities/Membership";
import { IMembershipRepository } from "../../domain/interface/Membership";
import MemebershipModel from "../database/MembershipSchema";

export class MembershipRepository implements IMembershipRepository {
  async createMembership(membership: Membership): Promise<Membership> {
    try {
      const createdMembership = await MemebershipModel.create(membership);
      return this.mapDocumentToEntity(createdMembership);
    } catch (err) {
      console.log(err);
      throw new Error("Error in creating membership");
    }
  }

  async updateMembership(
    membership: Partial<Membership>
  ): Promise<Membership | null> {
    try {
      const updatedMembership = await MemebershipModel.findOneAndUpdate(
        { membershipId: membership.membershipId },
        membership,
        { new: true }
      );
      return updatedMembership
        ? this.mapDocumentToEntity(updatedMembership)
        : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async toggleMembershipStatus(membershipId: string): Promise<Membership> {
    try {
      const membership = await MemebershipModel.findOne({ membershipId });
      if (!membership) throw new Error("Membership not found");
      membership.status = !membership.status;
      await membership.save();
      return this.mapDocumentToEntity(membership);
    } catch (err) {
      console.log(err);
      throw new Error("Error in toggling membership status");
    }
  }

  async findMembershipById(membershipId: string): Promise<Membership | null> {
    try {
      const membership = await MemebershipModel.findOne({ membershipId });
      return membership ? this.mapDocumentToEntity(membership) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findMembershipByUserId(userId: string): Promise<Membership | null> {
    try {
      const membership = await MemebershipModel.findOne({ userId });
      return membership ? this.mapDocumentToEntity(membership) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getAllMemberships(): Promise<Membership[]> {
    try {
      const memberships = await MemebershipModel.find({ status: true });
      return memberships.map(this.mapDocumentToEntity);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async findMembershipByIdV2(membershipId: string): Promise<Membership | null> {
    try {
      const membership = await MemebershipModel.findById(membershipId);
      return membership ? this.mapDocumentToEntity(membership) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async findCourseByCategoryId(categoryId: string): Promise<Membership[]> {
    try {
      const memberships = await MemebershipModel.find({ categoryId });
      return memberships.map(this.mapDocumentToEntity);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  private mapDocumentToEntity(doc: any): Membership {
    return {
      ...doc.toObject(),
      userId: doc.userId?.toString(),
    };
  }
}

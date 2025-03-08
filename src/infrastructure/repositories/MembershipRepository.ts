import { Membership } from "../../domain/entities/Membership";
import { IMembershipRepository } from "../../domain/interface/Membership";
import MemebershipModel from "../database/MembershipSchema";

export class MembershipRepository implements IMembershipRepository {
  async createMembership(membership: Membership): Promise<Membership> {
    const createdMembership = await MemebershipModel.create(membership);
    return this.mapDocumentToEntity(createdMembership);
  }

  async updateMembership(
    membership: Partial<Membership>
  ): Promise<Membership | null> {
    const updatedMembership = await MemebershipModel.findOneAndUpdate(
      { membershipId: membership.membershipId },
      membership,
      { new: true }
    );
    return updatedMembership
      ? this.mapDocumentToEntity(updatedMembership)
      : null;
  }

  async toggleMembershipStatus(membershipId: string): Promise<Membership> {
    const membership = await MemebershipModel.findOne({ membershipId });
    if (!membership) throw new Error("Membership not found");
    membership.status = !membership.status;
    await membership.save();
    return this.mapDocumentToEntity(membership);
  }

  async findMembershipById(membershipId: string): Promise<Membership | null> {
    const membership = await MemebershipModel.findOne({ membershipId });
    return membership ? this.mapDocumentToEntity(membership) : null;
  }

  async findMembershipByUserId(userId: string): Promise<Membership | null> {
    const membership = await MemebershipModel.findOne({ userId });
    return membership ? this.mapDocumentToEntity(membership) : null;
  }

  async getAllMemberships(): Promise<Membership[]> {
    const memberships = await MemebershipModel.find({ status: true });
    return memberships.map(this.mapDocumentToEntity);
  }

  async findMembershipByIdV2(membershipId: string): Promise<Membership | null> {
    const membership = await MemebershipModel.findById(membershipId);
    return membership ? this.mapDocumentToEntity(membership) : null;
  }

  async findCourseByCategoryId(categoryId: string): Promise<Membership[]> {
    const memberships = await MemebershipModel.find({ categoryId });
    return memberships.map(this.mapDocumentToEntity);
  }

  private mapDocumentToEntity(doc: any): Membership {
    return {
      ...doc.toObject(),
      userId: doc.userId?.toString(),
    };
  }
}

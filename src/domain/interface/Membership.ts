import { Membership } from "../entities/Membership";

export interface IMembershipRepository {
  createMembership(membership: Membership): Promise<Membership>;
  updateMembership(membership: Partial<Membership>): Promise<Membership | null>;
  toggleMembershipStatus(membershipId: string): Promise<Membership>;
  findMembershipById(membershipId: string): Promise<Membership | null>;
  findMembershipByUserId(userId: string): Promise<Membership | null>;
  getAllMemberships(): Promise<Membership[]>;
  findCourseByCategoryId(categoryId: string): Promise<Membership[]>;
}

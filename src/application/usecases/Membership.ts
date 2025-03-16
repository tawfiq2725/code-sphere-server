import { IMembershipRepository } from "../../domain/interface/Membership";
import { Membership } from "../../domain/entities/Membership";

export class CreateMembership {
  constructor(private membershipRepository: IMembershipRepository) {}
  public async execute(
    membershipData: Omit<Membership, "_id">
  ): Promise<Membership> {
    const newMembership = new Membership(
      membershipData.membershipId,
      membershipData.membershipName,
      membershipData.membershipDescription,
      membershipData.membershipPlan,
      membershipData.price,
      membershipData.label,
      membershipData.status
    );
    return this.membershipRepository.createMembership(newMembership);
  }
  public async execToggle(id: string) {
    try {
      const membership = await this.membershipRepository.toggleMembershipStatus(
        id
      );
      return membership;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public async execGetAll(): Promise<Membership[]> {
    try {
      const membership = await this.membershipRepository.getAllMemberships();
      return membership;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async execById(id: string): Promise<Membership | null> {
    try {
      const membership = await this.membershipRepository.findMembershipById(id);
      return membership;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export class updateMembershipUsecase {
  constructor(private membershipRepository: IMembershipRepository) {}
  public async execute(
    id: string,
    updatedData: Partial<Membership>
  ): Promise<any> {
    const existingMembership =
      await this.membershipRepository.findMembershipById(id);
    if (!existingMembership) {
      throw new Error("Not available");
    }
    return await this.membershipRepository.updateMembership(updatedData);
  }
}

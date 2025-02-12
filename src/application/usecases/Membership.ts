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
      membershipData.price,
      membershipData.label,
      membershipData.status
    );
    return this.membershipRepository.createMembership(newMembership);
  }
}

export class updateMembershipUsecase {
  constructor(private membershipRepository: IMembershipRepository) {}
  public async execute(updatedData: any): Promise<any> {
    return await this.membershipRepository.updateMembership(updatedData);
  }
}

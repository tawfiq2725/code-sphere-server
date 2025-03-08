import { Offer } from "../../domain/entities/Offer";
import { IOfferRepository } from "../../domain/interface/Offer";
import { PaginationOptions } from "../../utils/queryHelper";

export class OfferUseCase {
  constructor(private offerRepo: IOfferRepository) {}

  async createOffer(offer: Offer): Promise<Offer> {
    console.log(offer);
    let existCategory = await this.offerRepo.getOfferbyCategory(
      offer.categoryId
    );
    if (existCategory) {
      throw new Error("Offer already exist for this category");
    }
    return await this.offerRepo.createOffer(offer);
  }

  async updateOffer(id: string, offer: Offer): Promise<Offer> {
    return await this.offerRepo.updateOffer(id, offer);
  }

  async toggleOffer(id: string): Promise<Offer> {
    return await this.offerRepo.toggleOffer(id);
  }

  async getOfferById(id: string): Promise<Offer | null> {
    return await this.offerRepo.getOfferById(id);
  }

  async getOffers(options: PaginationOptions): Promise<Offer[]> {
    return await this.offerRepo.getOffers(options);
  }
}

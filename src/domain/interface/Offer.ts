import { PaginationOptions } from "../../utils/queryHelper";
import { Offer } from "../entities/Offer";

export interface IOfferRepository {
  createOffer(offer: Offer): Promise<Offer>;
  updateOffer(id: string, offer: Offer): Promise<Offer>;
  toggleOffer(id: string): Promise<Offer>;
  getOfferById(id: string): Promise<Offer | null>;
  getOffers(options: PaginationOptions): Promise<Offer[]>;
  getOfferbyCategory(categoryId: string): Promise<boolean>;
}

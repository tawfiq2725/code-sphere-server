import { IOfferRepository } from "../../domain/interface/Offer";
import { Offer } from "../../domain/entities/Offer";
import OfferModel from "../database/OfferSchema";
import { paginate, PaginationOptions } from "../../utils/queryHelper";

export class OfferRepository implements IOfferRepository {
  async createOffer(offer: Offer): Promise<Offer> {
    const createdOffer: any = await OfferModel.create({
      offerName: offer.offerName,
      discount: offer.discount,
      categoryId: offer.categoryId,
      startsFrom: offer.startsFrom,
      endsFrom: offer.endsFrom,
      status: true,
    });
    return createdOffer;
  }
  async getOfferbyCategory(categoryId: string): Promise<boolean> {
    const offer = await OfferModel.findOne({ categoryId });
    if (offer) return true;
    return false;
  }

  async updateOffer(id: string, offer: Offer): Promise<Offer> {
    console.log("tawfiq ", offer);
    const updatedOffer = await OfferModel.findByIdAndUpdate(
      id,
      {
        offerName: offer.offerName,
        discount: offer.discount,
        categoryId: offer.categoryId,
        startsFrom: offer.startsFrom,
        endsFrom: offer.endsFrom,
        status: true,
      },
      { new: true }
    );
    if (!updatedOffer) {
      throw new Error("Offer not found");
    }
    return updatedOffer;
  }

  async getOfferById(id: string): Promise<Offer | null> {
    const offer = (await OfferModel.findById(id)) as any;
    if (!offer) return null;
    return offer;
  }

  async getOffers(options: PaginationOptions): Promise<any> {
    const paginateOptions = {
      ...options,
      populate: "categoryId",
    };
    const offers = await paginate(OfferModel, paginateOptions, {});
    return offers;
  }

  async toggleOffer(id: string): Promise<Offer> {
    const offerDoc = await OfferModel.findById(id);
    if (!offerDoc) {
      throw new Error("Offer not found");
    }
    offerDoc.status = !offerDoc.status;
    const updatedOffer = (await offerDoc.save()) as any;
    return updatedOffer;
  }
}

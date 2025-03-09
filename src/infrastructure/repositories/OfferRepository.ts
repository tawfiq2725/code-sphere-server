import { IOfferRepository } from "../../domain/interface/Offer";
import { Offer } from "../../domain/entities/Offer";
import OfferModel from "../database/OfferSchema";
import { paginate, PaginationOptions } from "../../utils/queryHelper";

export class OfferRepository implements IOfferRepository {
  async createOffer(offer: Offer): Promise<Offer> {
    try {
      const createdOffer: any = await OfferModel.create({
        offerName: offer.offerName,
        discount: offer.discount,
        categoryId: offer.categoryId,
        startsFrom: offer.startsFrom,
        endsFrom: offer.endsFrom,
        status: true,
      });
      return createdOffer;
    } catch (err) {
      console.log(err);
      throw new Error("Error in creating offer");
    }
  }
  async getOfferbyCategory(categoryId: string): Promise<boolean> {
    try {
      const offer = await OfferModel.findOne({ categoryId });
      if (offer) return true;
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async updateOffer(id: string, offer: Offer): Promise<Offer> {
    try {
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
    } catch (err) {
      console.log(err);
      throw new Error("Error in updating offer");
    }
  }

  async getOfferById(id: string): Promise<Offer | null> {
    try {
      const offer = (await OfferModel.findById(id)) as any;
      if (!offer) return null;
      return offer;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getOffers(options: PaginationOptions): Promise<any> {
    try {
      const paginateOptions = {
        ...options,
        populate: "categoryId",
      };
      const offers = await paginate(OfferModel, paginateOptions, {});
      return offers;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async toggleOffer(id: string): Promise<Offer> {
    try {
      const offerDoc = await OfferModel.findById(id);
      if (!offerDoc) {
        throw new Error("Offer not found");
      }
      offerDoc.status = !offerDoc.status;
      const updatedOffer = (await offerDoc.save()) as any;
      return updatedOffer;
    } catch (err) {
      console.log(err);
      throw new Error("Error in updating offer");
    }
  }
}

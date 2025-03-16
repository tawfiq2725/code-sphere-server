import { Request, Response } from "express";
import { OfferUseCase } from "../../application/usecases/Offer";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";

export class OfferCtrl {
  constructor(private offerUsecase: OfferUseCase) {}
  public async createOffer(req: Request, res: Response): Promise<void> {
    try {
      const { offerName, discount, categoryId, startsFrom, endsFrom, status } =
        req.body;
      const offer = await this.offerUsecase.createOffer({
        offerName,
        discount,
        categoryId,
        startsFrom,
        endsFrom,
        status,
      });
      sendResponseJson(
        res,
        HttpStatus.CREATED,
        "Offer created successfully",
        true,
        offer
      );
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false
      );
    }
  }

  public async updateOffer(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const data = req.body;

      const offer = await this.offerUsecase.updateOffer(id, data);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Offer updated successfully",
        true,
        offer
      );
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false
      );
    }
  }
  public async getOffer(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const offer = await this.offerUsecase.getOfferById(id);
      if (offer) {
        sendResponseJson(res, HttpStatus.OK, "Offer found", true, offer);
      } else {
        sendResponseJson(res, HttpStatus.NOT_FOUND, "Offer not found", false);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  public async getOffers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const search = req.query.search as string;
      const category = req.query.category as string;
      const offers = await this.offerUsecase.getOffers({
        page,
        limit,
        search,
        category,
      });
      sendResponseJson(res, HttpStatus.OK, "Offers found", true, offers);
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false
      );
    }
  }
  public async toggleOffer(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const offer = await this.offerUsecase.toggleOffer(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Offer status toggled successfully",
        true,
        offer
      );
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        false
      );
    }
  }
}

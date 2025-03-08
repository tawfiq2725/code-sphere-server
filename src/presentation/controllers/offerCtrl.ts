import { Request, Response } from "express";
import { OfferUseCase } from "../../application/usecases/Offer";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { OfferRepository } from "../../infrastructure/repositories/OfferRepository";

export const createOffer = async (req: Request, res: Response) => {
  try {
    const { offerName, discount, categoryId, startsFrom, endsFrom, status } =
      req.body;
    console.log(req.body);
    const offerRepo = new OfferRepository();
    const offerUseCase = new OfferUseCase(offerRepo);
    const offer = await offerUseCase.createOffer({
      offerName,
      discount,
      categoryId,
      startsFrom,
      endsFrom,
      status,
    });
    return sendResponseJson(
      res,
      HttpStatus.CREATED,
      "Offer created successfully",
      true,
      offer
    );
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body;
    console.log(data);

    const offerRepo = new OfferRepository();
    const offerUseCase = new OfferUseCase(offerRepo);
    const offer = await offerUseCase.updateOffer(id, data);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Offer updated successfully",
      true,
      offer
    );
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const getOffer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const offerRepo = new OfferRepository();
    const offerUseCase = new OfferUseCase(offerRepo);
    const offer = await offerUseCase.getOfferById(id);
    if (offer) {
      return sendResponseJson(res, HttpStatus.OK, "Offer found", true, offer);
    } else {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Offer not found",
        false
      );
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOffers = async (req: Request, res: Response) => {
  try {
    const offerRepo = new OfferRepository();
    const offerUseCase = new OfferUseCase(offerRepo);
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const offers = await offerUseCase.getOffers({
      page,
      limit,
      search,
      category,
    });
    return sendResponseJson(res, HttpStatus.OK, "Offers found", true, offers);
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

export const toggleOffer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const offerRepo = new OfferRepository();
    const offerUseCase = new OfferUseCase(offerRepo);
    const offer = await offerUseCase.toggleOffer(id);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Offer status toggled successfully",
      true,
      offer
    );
  } catch (error: any) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message,
      false
    );
  }
};

import { OfferRepository } from "../../infrastructure/repositories/OfferRepository";
import { OfferUseCase } from "../../application/usecases/Offer";
import { OfferCtrl } from "../controllers/offerCtrl";

const offerRepo = new OfferRepository();
const offerUsecase = new OfferUseCase(offerRepo);

export const offerCtrlDI = new OfferCtrl(offerUsecase);

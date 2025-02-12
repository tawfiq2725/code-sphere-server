import { Request, Response } from "express";
import {
  CreateMembership,
  updateMembershipUsecase,
} from "../../application/usecases/Membership";
import { MembershipRepository } from "../../infrastructure/repositories/MembershipRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
export const createMembership = async (req: Request, res: Response) => {
  try {
    const { membershipName, membershipDescription, price, label } = req.body;
    const membershipArray = membershipDescription.split(",");
    const generateId = `MEMBER-${Math.floor(Math.random() * 1000)}`;
    const membershipData = {
      membershipId: generateId,
      membershipName,
      membershipDescription: membershipArray,
      price,
      label,
      status: true,
    };
    const membershipRepo = new MembershipRepository();
    const newMembership = new CreateMembership(membershipRepo);
    const membership = await newMembership.execute(membershipData);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Membership created successfully",
      true,
      membership
    );
  } catch (err) {
    console.log(err);
  }
};
export const updateMembership = async (req: Request, res: Response) => {
  try {
    const membershipRepo = new MembershipRepository();
    const { id } = req.params;
    let existingMembership = await membershipRepo.findMembershipById(id);
    if (!existingMembership) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Membership not found",
        false
      );
    }
    const updatedData = { ...req.body, membershipId: id };

    const membership = new updateMembershipUsecase(membershipRepo);
    const updates = await membership.execute(updatedData);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Membership updated successfully",
      true,
      updates
    );
  } catch (error: any) {
    console.log(error);
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
export const toggleMembershipStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const membershipRepo = new MembershipRepository();
  try {
    const membership = await membershipRepo.toggleMembershipStatus(id);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Membership status toggled successfully",
      true,
      membership
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
export const getAllMemberships = async (req: Request, res: Response) => {
  try {
    const membershipRepo = new MembershipRepository();
    const memberships = await membershipRepo.getAllMemberships();
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Memberships retrieved successfully",
      true,
      memberships
    );
  } catch (err: any) {
    console.log(err);
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, err.message, false);
  }
};

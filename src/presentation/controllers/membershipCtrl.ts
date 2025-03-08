import { Request, Response } from "express";
import {
  CreateMembership,
  updateMembershipUsecase,
} from "../../application/usecases/Membership";
import { MembershipRepository } from "../../infrastructure/repositories/MembershipRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { MembershipOrderRepository } from "../../infrastructure/repositories/MembershipOrder";
import { CourseRepositoryImpl } from "../../infrastructure/repositories/CourseRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export const createMembership = async (req: Request, res: Response) => {
  try {
    const {
      membershipName,
      membershipDescription,
      membershipPlan,
      label,
      price,
    } = req.body;
    const generateId = `MEMBER-${Math.floor(Math.random() * 1000)}`;
    const membershipData = {
      membershipId: generateId,
      membershipName,
      membershipDescription,
      membershipPlan, // New field from updated schema
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
    console.error(err);
    return sendResponseJson(
      res,
      HttpStatus.BAD_REQUEST,
      "Failed to create membership",
      false
    );
  }
};

export const updateMembership = async (req: Request, res: Response) => {
  try {
    const membershipRepo = new MembershipRepository();
    const { id } = req.params;
    const existingMembership = await membershipRepo.findMembershipById(id);
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
    console.error(error);
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
    console.error(err);
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, err.message, false);
  }
};

// User side endpoints

export const getMemberships = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getMembershipById = async (req: Request, res: Response) => {
  try {
    const membershipRepo = new MembershipRepository();
    const { id } = req.params;
    const membership = await membershipRepo.findMembershipById(id);
    if (!membership) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Membership not found",
        false
      );
    }
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Membership retrieved successfully",
      true,
      membership
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getMembershipByOId = async (req: Request, res: Response) => {
  try {
    console.log("here 1");
    const membershipRepo = new MembershipOrderRepository();
    console.log("here 2");
    const { id } = req.params;
    console.log("here 3");
    console.log(id);
    const membership = await membershipRepo.getMembershipOrderByUserId(id);
    if (!membership) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Membership not found",
        false
      );
    }
    console.log(membership);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Membership retrieved successfully",
      true,
      membership
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getCoursesByMembershipId = async (req: Request, res: Response) => {
  try {
    const repo = new CourseRepositoryImpl();
    const { id } = req.params;
    const membership = await repo.findCouresByCategoryId(id);
    if (!membership) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Courses not found",
        false
      );
    }
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Courses retrieved successfully",
      true,
      membership
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getAllMembershipOrders = async (req: Request, res: Response) => {
  try {
    const membershipRepo = new MembershipOrderRepository();
    const memberships = await membershipRepo.getAllMembershipOrders();
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Membership orders retrieved successfully",
      true,
      memberships
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getMembershipOrderById = async (req: Request, res: Response) => {
  try {
    const membershipRepo = new MembershipOrderRepository();
    const { id } = req.params;
    const membership = await membershipRepo.findMembershipOrderById(id);
    if (!membership) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "Membership order not found",
        false
      );
    }
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Membership order retrieved successfully",
      true,
      membership
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getCertificatesByStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userRepo = new UserRepository();
  try {
    const certificates = await userRepo.getCertificatesByStudent(id);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Certificates retrieved successfully",
      true,
      certificates
    );
  } catch (error: any) {
    return sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

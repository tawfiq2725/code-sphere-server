import { Request, Response } from "express";
import {
  CreateMembership,
  updateMembershipUsecase,
} from "../../application/usecases/Membership";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { MembershipOrderUsecase } from "../../application/usecases/MembershipUsecase";

export class MembershipCtrl {
  constructor(
    private createMembershipUsecase: CreateMembership,
    private editMembershipUsecase: updateMembershipUsecase,
    private membershipOrderUsecase: MembershipOrderUsecase
  ) {}

  public async createMembership(req: Request, res: Response): Promise<void> {
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
        membershipPlan,
        price,
        label,
        status: true,
      };
      const membership = await this.createMembershipUsecase.execute(
        membershipData
      );
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Membership created successfully",
        true,
        membership
      );
    } catch (err) {
      console.error(err);
      sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Failed to create membership",
        false
      );
    }
  }

  public async updateMembership(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedData = { ...req.body, membershipId: id };
      const updates = await this.editMembershipUsecase.execute(id, updatedData);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Membership updated successfully",
        true,
        updates
      );
    } catch (error: any) {
      console.error(error);
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async toggleMembershipStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    try {
      const membership = await this.createMembershipUsecase.execToggle(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Membership status toggled successfully",
        true,
        membership
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async getAllMemberships(req: Request, res: Response): Promise<void> {
    try {
      const memberships = await this.createMembershipUsecase.execGetAll();
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Memberships retrieved successfully",
        true,
        memberships
      );
    } catch (err: any) {
      console.error(err);
      sendResponseJson(res, HttpStatus.BAD_REQUEST, err.message, false);
    }
  }
  public async getMemberships(req: Request, res: Response): Promise<void> {
    try {
      const memberships = await this.createMembershipUsecase.execGetAll();
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Memberships retrieved successfully",
        true,
        memberships
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async getMembershipById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const membership = await this.createMembershipUsecase.execById(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Membership retrieved successfully",
        true,
        membership
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getMembershipByOId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const membership = await this.membershipOrderUsecase.execByUserId(id);
      if (!membership) {
        sendResponseJson(
          res,
          HttpStatus.NOT_FOUND,
          "Membership not found",
          false
        );
        return;
      }
      console.log(membership);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Membership retrieved successfully",
        true,
        membership
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getCoursesByMembershipId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const membership = await this.membershipOrderUsecase.execByCategoryId(id);
      if (!membership) {
        sendResponseJson(res, HttpStatus.NOT_FOUND, "Courses not found", false);
        return;
      }
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Courses retrieved successfully",
        true,
        membership
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async getAllMembershipOrders(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const memberships = await this.membershipOrderUsecase.execGetAll();
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Membership orders retrieved successfully",
        true,
        memberships
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getMembershipOrderById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const membership = await this.membershipOrderUsecase.execById(id);
      if (!membership) {
        sendResponseJson(
          res,
          HttpStatus.NOT_FOUND,
          "Membership order not found",
          false
        );
        return;
      }
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Membership order retrieved successfully",
        true,
        membership
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getCertificatesByStudent(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    try {
      const certificates = await this.membershipOrderUsecase.execGetCertificate(
        id
      );
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Certificates retrieved successfully",
        true,
        certificates
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
}

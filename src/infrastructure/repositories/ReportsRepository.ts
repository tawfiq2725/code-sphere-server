import OrderS from "../database/orderSchema";
import { Order } from "../../domain/entities/Order";
import { ReportInterface } from "../../domain/interface/Report";
import userSchema from "../database/userSchema";
import Course from "../database/courseSchema";

export class ReportsRepository implements ReportInterface {
  public async getReportsOrders(
    startDate: Date,
    endDate: Date
  ): Promise<Order[]> {
    return await OrderS.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });
  }
  public async getReportsMembershipb(): Promise<any> {
    return await OrderS.find({ orderType: "membership" });
  }
  public async getOverallReports(): Promise<any> {
    return await OrderS.find();
  }
  public async adminDashboards(): Promise<any> {
    const totalUsers = await userSchema
      .find({ role: "student" })
      .countDocuments();
    const totalTutors = await userSchema
      .find({ role: "tutor" })
      .countDocuments();
    const totalOrders = await OrderS.find({
      orderStatus: "success",
    }).countDocuments();
    const totalCourses = await Course.find({
      courseStatus: "approved",
    }).countDocuments();

    const totalRevenueResult = await OrderS.aggregate([
      {
        $match: {
          orderStatus: "success",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $convert: { input: "$totalAmount", to: "double", onError: 0 },
            },
          },
        },
      },
    ]);
    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    return {
      totalUsers,
      totalTutors,
      totalOrders,
      totalCourses,
      totalRevenue,
    };
  }

  public async getRevenueData(groupBy: any): Promise<any> {
    const revenueData = await OrderS.aggregate([
      {
        $match: {
          orderStatus: "success",
        },
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: {
            $sum: {
              $convert: { input: "$totalAmount", to: "double", onError: 0 },
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return revenueData;
  }

  public async getCourseEnrollments(): Promise<any> {
    const enrollmentAggregation = await userSchema.aggregate([
      { $unwind: "$courseProgress" },
      {
        $group: {
          _id: "$courseProgress.courseId",
          enrollmentCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "courseId",
          as: "courseDetails",
        },
      },
      { $unwind: "$courseDetails" },
      {
        $project: {
          courseName: "$courseDetails.courseName",
          enrollmentCount: 1,
          _id: 0,
        },
      },
    ]);
    return enrollmentAggregation;
  }

  public async topTutors(): Promise<any> {
    const topTutorsAggregation = await OrderS.aggregate([
      {
        $match: {
          orderStatus: "success",
        },
      },
      {
        $group: {
          _id: "$courseId", // courseId is a String
          enrollmentCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "courseId",
          as: "courseDetails",
        },
      },
      {
        $unwind: "$courseDetails",
      },
      {
        $group: {
          _id: "$courseDetails.tutorId", // tutorId is a String
          totalEnrollments: { $sum: "$enrollmentCount" },
        },
      },
      {
        $lookup: {
          from: "users",
          let: { tutorIdStr: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, "$$tutorIdStr"], // Convert ObjectId to String
                },
              },
            },
          ],
          as: "tutorDetails",
        },
      },
      {
        $unwind: "$tutorDetails",
      },
      {
        $match: {
          "tutorDetails.isTutor": true,
        },
      },
      {
        $project: {
          _id: 0,
          tutorId: "$_id",
          tutorName: "$tutorDetails.name",
          totalEnrollments: 1,
        },
      },
      {
        $sort: { totalEnrollments: -1 },
      },

      {
        $limit: 5,
      },
    ]);
    return topTutorsAggregation;
  }

  public async tutorDashboards(): Promise<any> {
    return await OrderS.find();
  }
  public async topCourses(): Promise<any> {
    return await OrderS.find();
  }
}

import OrderS from "../database/orderSchema";
import MembershipOrder from "../database/order-mSchema";
import { Order } from "../../domain/entities/Order";
import { ReportInterface } from "../../domain/interface/Report";
import userSchema from "../database/userSchema";
import Course from "../database/courseSchema";

export class ReportsRepository implements ReportInterface {
  public async getReportsOrders(
    startDate: Date,
    endDate: Date
  ): Promise<Order[]> {
    try {
      return await OrderS.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async getReportsMembershipb(): Promise<any> {
    try {
      return await OrderS.find({ orderType: "membership" });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async getOverallReports(): Promise<any> {
    try {
      return await OrderS.find();
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async adminDashboards(): Promise<any> {
    try {
      const totalUsers = await userSchema
        .find({ role: "student" })
        .countDocuments();
      const totalTutors = await userSchema
        .find({ role: "tutor" })
        .countDocuments();
      const totalOrder = await OrderS.find({
        orderStatus: "success",
      }).countDocuments();
      const totalMemberships = await MembershipOrder.find({
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
      const totalMembershipsRevenue = await MembershipOrder.aggregate([
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
        (totalRevenueResult[0]?.total || 0) +
        (totalMembershipsRevenue[0]?.total || 0);
      const totalOrders = totalOrder + totalMemberships;
      return {
        totalUsers,
        totalTutors,
        totalOrders,
        totalCourses,
        totalRevenue,
      };
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async getRevenueData(groupBy: any): Promise<any> {
    try {
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
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async getCourseEnrollments(): Promise<any> {
    try {
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
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async topTutors(): Promise<any> {
    try {
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
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async tutorDashboards(): Promise<any> {
    try {
      return await OrderS.find();
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async topCourses(): Promise<any> {
    try {
      return await OrderS.find();
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async getMembershipReports(
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      return await MembershipOrder.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async getTutorDashboard(tutorId: string): Promise<any> {
    try {
      const courses = await Course.find({ tutorId, courseStatus: "approved" });
      const courseIds = courses.map((course: any) => course.courseId);
      const totalCourses = courses.length;
      const totalEnrollments = await OrderS.find({
        courseId: { $in: courseIds },
        orderStatus: "success",
      }).countDocuments();
      const uniqueStudentsAgg = await OrderS.aggregate([
        { $match: { courseId: { $in: courseIds }, orderStatus: "success" } },
        { $group: { _id: "$userId" } },
        { $count: "totalStudents" },
      ]);
      const totalStudents =
        uniqueStudentsAgg.length > 0 ? uniqueStudentsAgg[0].totalStudents : 0;
      const revenueAgg = await OrderS.aggregate([
        {
          $match: { courseId: { $in: courseIds }, orderStatus: "success" },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $convert: {
                  input: "$totalAmount",
                  to: "double",
                  onError: 0,
                },
              },
            },
          },
        },
      ]);
      const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

      const progressAgg = await userSchema.aggregate([
        { $match: { "courseProgress.courseId": { $in: courseIds } } },
        { $unwind: "$courseProgress" },
        { $match: { "courseProgress.courseId": { $in: courseIds } } },
        {
          $group: {
            _id: null,
            avgProgress: { $avg: "$courseProgress.progress" },
            totalEnrolled: { $sum: 1 },
            completedCourses: {
              $sum: {
                $cond: [{ $eq: ["$courseProgress.progress", 100] }, 1, 0],
              },
            },
          },
        },
      ]);
      let avgProgress = 0,
        enrolledCount = 0,
        completedCount = 0;
      if (progressAgg && progressAgg.length > 0) {
        avgProgress = progressAgg[0].avgProgress;
        enrolledCount = progressAgg[0].totalEnrolled;
        completedCount = progressAgg[0].completedCourses;
      }
      const completionRate =
        enrolledCount > 0 ? (completedCount / enrolledCount) * 100 : 0;
      const enrollmentTrendAgg = await OrderS.aggregate([
        {
          $match: { courseId: { $in: courseIds }, orderStatus: "success" },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return {
        totalCourses,
        totalEnrollments,
        totalStudents,
        totalRevenue,
        avgProgress,
        enrolledCount,
        completedCount,
        completionRate,
        enrollmentTrend: enrollmentTrendAgg,
      };
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}

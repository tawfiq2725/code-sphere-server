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

  public async getRevenueData(groupBy: string): Promise<any> {
    try {
      const revenueData = await OrderS.aggregate([
        {
          $match: { orderStatus: "success" },
        },

        {
          $project: {
            groupField: groupBy,
            revenue: {
              $convert: { input: "$totalAmount", to: "double", onError: 0 },
            },
          },
        },

        {
          $unionWith: {
            coll: "membershiporders",
            pipeline: [
              { $match: { orderStatus: "success" } },
              {
                $project: {
                  groupField: groupBy,
                  revenue: "$totalAmount",
                },
              },
            ],
          },
        },

        {
          $group: {
            _id: "$groupField",
            totalRevenue: { $sum: "$revenue" },
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
        // === Pipeline for regular orders ===
        {
          $match: { orderStatus: "success" },
        },
        {
          $group: {
            _id: "$courseId", // courseId is a String in orders
            enrollmentCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "courses", // lookup course details to get tutorId
            localField: "_id",
            foreignField: "courseId",
            as: "courseDetails",
          },
        },
        { $unwind: "$courseDetails" },
        {
          $group: {
            _id: "$courseDetails.tutorId", // tutorId comes from course details
            totalEnrollments: { $sum: "$enrollmentCount" },
          },
        },
        // === Union with membership orders pipeline ===
        {
          $unionWith: {
            coll: "membershiporders", // ensure this matches your collection name
            pipeline: [
              { $match: { orderStatus: "success" } },
              // Lookup membership document to get tutorId (assumes memberships collection has tutorId)
              {
                $lookup: {
                  from: "memberships", // adjust if your memberships collection is named differently
                  localField: "membershipId",
                  foreignField: "_id",
                  as: "membershipDetails",
                },
              },
              { $unwind: "$membershipDetails" },
              // Project a common field: tutorId and count each membership order as one enrollment
              {
                $project: {
                  tutorId: "$membershipDetails.tutorId",
                  enrollmentCount: { $literal: 1 },
                },
              },
              {
                $group: {
                  _id: "$tutorId",
                  totalEnrollments: { $sum: "$enrollmentCount" },
                },
              },
            ],
          },
        },
        // === Re-group to combine enrollments from both pipelines ===
        {
          $group: {
            _id: "$_id",
            totalEnrollments: { $sum: "$totalEnrollments" },
          },
        },
        // === Lookup tutor details from users ===
        {
          $lookup: {
            from: "users",
            let: { tutorIdStr: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: "$_id" }, "$$tutorIdStr"] },
                },
              },
            ],
            as: "tutorDetails",
          },
        },
        { $unwind: "$tutorDetails" },
        // Only include documents where the user is marked as a tutor
        {
          $match: { "tutorDetails.isTutor": true },
        },
        {
          $project: {
            _id: 0,
            tutorId: "$_id",
            tutorName: "$tutorDetails.name",
            totalEnrollments: 1,
          },
        },
        { $sort: { totalEnrollments: -1 } },
        { $limit: 5 },
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
      // Fetch tutor's courses that are approved
      const courses = await Course.find({ tutorId, courseStatus: "approved" });
      const totalCourses = courses.length;
      const courseIds = courses.map((course) => course.courseId);

      // Fetch normal course orders
      const orders = await OrderS.find({
        courseId: { $in: courseIds },
        orderStatus: "success",
      });

      // Fetch membership orders
      const membershipOrders = await MembershipOrder.find({
        orderStatus: "success",
      });

      // Total enrollments: sum of normal orders and membership orders
      const totalEnrollments = orders.length + membershipOrders.length;

      // Total revenue: sum revenue from orders and membership orders
      const ordersRevenue = orders.reduce((sum, order) => {
        return sum + parseFloat(order.totalAmount);
      }, 0);
      const membershipRevenue = membershipOrders.reduce((sum, mOrder) => {
        return sum + mOrder.totalAmount;
      }, 0);
      const totalRevenue = ordersRevenue + membershipRevenue;

      const studentIdsSet = new Set(orders.map((order) => order.userId));
      membershipOrders.forEach((mOrder) => {
        if (mOrder.userId) {
          studentIdsSet.add(mOrder.userId.toString());
        }
      });
      const totalStudents = studentIdsSet.size;

      const studentIds = Array.from(
        new Set(orders.map((order) => order.userId))
      );
      const users = await userSchema.find({ _id: { $in: studentIds } });

      let totalProgress = 0;
      let enrolledCount = 0;
      let completedCount = 0;

      users.forEach((user) => {
        if (user.courseProgress && Array.isArray(user.courseProgress)) {
          user.courseProgress.forEach((progressEntry) => {
            if (courseIds.includes(progressEntry.courseId)) {
              enrolledCount++;
              totalProgress += progressEntry.progress;

              if (
                progressEntry.progress >= 100 ||
                (progressEntry.totalChapters > 0 &&
                  progressEntry.completedChapters.length ===
                    progressEntry.totalChapters)
              ) {
                completedCount++;
              }
            }
          });
        }
      });

      const avgProgress = enrolledCount > 0 ? totalProgress / enrolledCount : 0;
      const completionRate =
        enrolledCount > 0 ? (completedCount / enrolledCount) * 100 : 0;

      const enrollmentTrend: { [key: string]: number } = {};
      const addToTrend = (date: Date) => {
        const key = `${date.getFullYear()}-${(
          "0" +
          (date.getMonth() + 1)
        ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        enrollmentTrend[key] = (enrollmentTrend[key] || 0) + 1;
      };

      orders.forEach((order) => {
        const date = new Date(order?.createdAt || new Date());
        addToTrend(date);
      });

      membershipOrders.forEach((mOrder) => {
        const date = new Date(mOrder?.createdAt || new Date());
        addToTrend(date);
      });

      return {
        totalCourses,
        totalEnrollments,
        totalStudents,
        totalRevenue,
        avgProgress,
        enrolledCount,
        completedCount,
        completionRate,
        enrollmentTrend,
      };
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

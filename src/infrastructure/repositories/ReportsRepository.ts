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
      const courses = await Course.find({ tutorId, courseStatus: "approved" });
      const courseIds = courses.map((course: any) => course.courseId);
      const totalCourses = courses.length;

      const totalOrderEnrollments = await OrderS.find({
        courseId: { $in: courseIds },
        orderStatus: "success",
      }).countDocuments();

      const ordersUniqueStudentsAgg = await OrderS.aggregate([
        { $match: { courseId: { $in: courseIds }, orderStatus: "success" } },
        { $group: { _id: "$userId" } },
        { $group: { _id: null, uniqueCount: { $sum: 1 } } },
      ]);
      const ordersUniqueStudents =
        ordersUniqueStudentsAgg.length > 0
          ? ordersUniqueStudentsAgg[0].uniqueCount
          : 0;

      const ordersRevenueAgg = await OrderS.aggregate([
        { $match: { courseId: { $in: courseIds }, orderStatus: "success" } },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $convert: { input: "$totalAmount", to: "double", onError: 0 },
              },
            },
          },
        },
      ]);
      const ordersRevenue = ordersRevenueAgg[0]?.totalRevenue || 0;

      const orderEnrollmentTrendAgg = await OrderS.aggregate([
        {
          $match: { courseId: { $in: courseIds }, orderStatus: "success" },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const membershipOrdersAgg = await MembershipOrder.aggregate([
        { $match: { orderStatus: "success" } },
        {
          $lookup: {
            from: "memberships",
            localField: "membershipId",
            foreignField: "_id",
            as: "membershipDetails",
          },
        },
        { $unwind: "$membershipDetails" },
        { $match: { "membershipDetails.tutorId": tutorId } },
      ]);

      const totalMembershipEnrollments = membershipOrdersAgg.length;
      const membershipRevenue = membershipOrdersAgg.reduce(
        (acc, curr) => acc + curr.totalAmount,
        0
      );

      const membershipUniqueStudentsSet = new Set(
        membershipOrdersAgg.map((order) => order.userId.toString())
      );
      const membershipUniqueStudents = membershipUniqueStudentsSet.size;

      const totalEnrollments =
        totalOrderEnrollments + totalMembershipEnrollments;
      const totalRevenue = ordersRevenue + membershipRevenue;
      const ordersUniqueStudentsList: string[] = await OrderS.distinct(
        "userId",
        {
          courseId: { $in: courseIds },
          orderStatus: "success",
        }
      );
      const combinedUniqueStudentsSet = new Set([
        ...ordersUniqueStudentsList.map(String),
        ...Array.from(membershipUniqueStudentsSet),
      ]);
      const totalStudents = combinedUniqueStudentsSet.size;

      const membershipEnrollmentTrendAgg = await MembershipOrder.aggregate([
        { $match: { orderStatus: "success" } },
        {
          $lookup: {
            from: "memberships",
            localField: "membershipId",
            foreignField: "_id",
            as: "membershipDetails",
          },
        },
        { $unwind: "$membershipDetails" },
        { $match: { "membershipDetails.tutorId": tutorId } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const enrollmentTrendMap = new Map<string, number>();
      for (const trend of orderEnrollmentTrendAgg) {
        enrollmentTrendMap.set(trend._id, trend.count);
      }
      for (const trend of membershipEnrollmentTrendAgg) {
        enrollmentTrendMap.set(
          trend._id,
          (enrollmentTrendMap.get(trend._id) || 0) + trend.count
        );
      }
      const enrollmentTrend = Array.from(enrollmentTrendMap.entries())
        .map(([date, count]) => ({ _id: date, count }))
        .sort((a, b) => a._id.localeCompare(b._id));

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
      console.log(err);
      return [];
    }
  }
}

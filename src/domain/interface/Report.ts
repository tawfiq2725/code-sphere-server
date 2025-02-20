import { Order } from "../entities/Order";
import { MembershipOrder } from "../entities/Membership-Order";

export interface ReportInterface {
  getReportsOrders(startDate: Date, endDate: Date): Promise<Order[]>;
  getReportsMembershipb(): Promise<any>;
  getOverallReports(): Promise<MembershipOrder[]>;
  adminDashboards(): Promise<any>;
  getRevenueData(groupBy: any): Promise<any>;
  getCourseEnrollments(): Promise<any>;
  tutorDashboards(): Promise<any>;
  topCourses(): Promise<any>;
  topTutors(): Promise<any>;
}

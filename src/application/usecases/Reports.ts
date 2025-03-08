import { Order } from "../../domain/entities/Order";
import { ReportInterface } from "../../domain/interface/Report";

export class ReportsUseCase {
  constructor(private reportRepository: ReportInterface) {}
  public async execute(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.reportRepository.getReportsOrders(startDate, endDate);
  }
}

export class DashboardUseCase {
  constructor(private reportRepository: ReportInterface) {}
  public async execute(): Promise<Order[]> {
    return this.reportRepository.adminDashboards();
  }
}

export class RevenueUseCase {
  constructor(private reportRepository: ReportInterface) {}
  public async execute(filter: any): Promise<any> {
    let groupBy;
    let labelsMap: string[] | ((value: any) => string) = [];

    switch (filter) {
      case "daily":
        groupBy = { $dayOfWeek: "$createdAt" };
        labelsMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        break;
      case "weekly":
        groupBy = { $week: "$createdAt" };
        labelsMap = (week: any) => `Week ${week}`;
        break;
      case "monthly":
        groupBy = { $month: "$createdAt" };
        labelsMap = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        break;
      case "yearly":
        groupBy = { $year: "$createdAt" };
        labelsMap = (year: any) => year.toString();
        break;
    }

    const revenueData = await this.reportRepository.getRevenueData(groupBy);

    let labels: string[] = [];
    let data: number[] = [];

    if (filter === "daily" || filter === "monthly") {
      labels = labelsMap as string[];
      data = labels.map((_, index) => {
        const entry: { _id: number; totalRevenue: number } | undefined =
          revenueData.find(
            (item: { _id: number }) =>
              item._id === (filter === "daily" ? index + 1 : index + 1)
          );
        return entry ? entry.totalRevenue : 0;
      });
    } else {
      labels = revenueData.map((item: { _id: any }) => {
        if (typeof labelsMap === "function") {
          return labelsMap(item._id);
        }
        return "";
      });
      data = revenueData.map(
        (item: { totalRevenue: number }) => item.totalRevenue
      );
    }

    const response = {
      labels,
      datasets: [
        {
          label: `${filter.charAt(0).toUpperCase() + filter.slice(1)} Revenue`,
          data,
          fill: false,
          borderColor: "#4ade80",
          tension: 0.4,
        },
      ],
    };
    return response;
  }
}

export class EnrollCourseUseCase {
  constructor(private reportRepository: ReportInterface) {}
  public async execute(): Promise<any> {
    const enrollmentAggregation =
      await this.reportRepository.getCourseEnrollments();

    const labels = enrollmentAggregation.map((item: any) => item.courseName);
    const data = enrollmentAggregation.map((item: any) => item.enrollmentCount);

    const backgroundColors = [
      "#4ade80",
      "#60a5fa",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#10b981",
      "#f97316",
    ];

    const chartColors = labels.map(
      (_: any, index: number) =>
        backgroundColors[index % backgroundColors.length]
    );

    const response = {
      labels,
      datasets: [
        {
          label: "Enrollments",
          data,
          backgroundColor: chartColors,
          hoverOffset: 4,
        },
      ],
    };
    return response;
  }
}

export class topTutorsUsecase {
  constructor(private reportRepository: ReportInterface) {}
  public async execute(): Promise<any> {
    const tutors = await this.reportRepository.topTutors();
    console.log(tutors);
    return tutors;
  }
}

export class membershipReportUsecase {
  constructor(private reportRepository: ReportInterface) {}
  public async execute(startDate: Date, endDate: Date): Promise<any> {
    const memberships = await this.reportRepository.getMembershipReports(
      startDate,
      endDate
    );
    return memberships;
  }
}

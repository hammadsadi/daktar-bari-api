export interface ISchedulePayload {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface IFilterSchedule {
  startDate?: string;
  endDate?: string;
}

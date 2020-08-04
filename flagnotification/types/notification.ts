export type Notification = {
  id: string;
  type: "info" | "alert" | "success" | "fail" | "custom";
  message: string;
  detail?: string;
  flagTime: number;
};
export default Notification;

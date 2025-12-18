export const SCHEDULE_URL = process.env.NEXT_PUBLIC_SCHEDULE_URL || "https://calendar.app.google/C9HXxJEMqBk1na2v8";

export const getScheduleUrl = () => SCHEDULE_URL;

export const openSchedulePopup = () => {
  if (typeof window !== "undefined") {
    window.open(SCHEDULE_URL, "_blank");
  }
};



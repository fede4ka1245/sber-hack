import moment from "moment";

export class StampValidator {
  static formatSecondsToString = (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours) {
      return `${hours.toString().toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  static isTimeStringValid = (time) => {
    return !isNaN(time) || moment(time, "hh:mm:ss", true).isValid() || moment(time, "mm:ss", true).isValid();
  }

  static formatStringToSeconds = (time) => {
    return time.split(':').reduce((acc,time) => (60 * acc) + +time);
  }
}
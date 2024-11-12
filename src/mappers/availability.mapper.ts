import { formatDate, formatTime } from 'src/utils/dateformatter';

export const mapAvailability = (availabilities: any) => {
  return availabilities.map((availability) => ({
    _id: availability._id,
    status_availability: availability.status_availability,
    date_availability: formatDate(availability.date_availability),
    hour_debut: formatTime(availability.hour_debut),
    hour_end: formatTime(availability.hour_end),
    date_initial: availability.date_availability,
  }));
};

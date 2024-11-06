import { formatDate, formatTime } from '../utils/dateformatter';

export const mapAudience = (audiences: any) => {
  return audiences.map((audience) => ({
    _id: audience._id,
    status_audience: audience.status_audience,
    user: audience.user ? audience.user._id : '',
    user_nom: audience.user ? audience.user.nom : '',
    user_prenom: audience.user ? audience.user.prenom : '',
    user_email: audience.user ? audience.user.email : '',
    user_cni: audience.user ? audience.user.cni : '',
    user_profile_photo: audience.user ? audience.user.profile_photo : '',
    availability: audience.availability ? audience.availability._id : '',
    availability_date: audience.availability ? formatDate(audience.availability.date_availability) : '',
    availability_hour_debut: audience.availability ? formatTime(audience.availability.hour_debut) : '',
    availability_hour_end: audience.availability ? formatTime(audience.availability.hour_end) : '',
    request: audience.request ? audience.request._id : '',
    request_object: audience.request ? audience.request.object : '',
    request_type: audience.request ? audience.request.type_request : '',
  }));
};

export const mapSingleRequest = (request: any) => {
  return {
    user: request.user ? request.user._id : '',
    user_nom: request.user ? request.user.nom : '',
    user_prenom: request.user ? request.user.prenom : '',
    user_cni: request.user ? request.user.cni : '',
    _id: request._id,
    type_request: request.type_request,
    object: request.object,
    date_wanted_debut: request.date_wanted_debut,
    date_wanted_end: request.date_wanted_end,
    request_creation: request.request_creation,
    status_request: request.status_request,
  };
};

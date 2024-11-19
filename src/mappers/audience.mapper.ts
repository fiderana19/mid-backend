import { formatDate, formatTime } from '../utils/dateformatter';

export const mapAudience = (audiences: any) => {
  return audiences.map((audience) => ({
    _id: audience._id,
    ref_audience: audience.ref_audience,
    status_audience: audience.status_audience,
    user: audience.user ? audience.user._id : '',
    user_nom: audience.user ? audience.user.nom : '',
    user_prenom: audience.user ? audience.user.prenom : '',
    user_email: audience.user ? audience.user.email : '',
    user_adresse: audience.user ? audience.user.adresse : '',
    user_telephone: audience.user ? audience.user.telephone : '',
    user_cni: audience.user ? audience.user.cni : '',
    user_profile_photo: audience.user ? audience.user.profile_photo : '',
    availability: audience.availability ? audience.availability._id : '',
    availability_date: audience.availability
      ? formatDate(audience.availability.date_availability)
      : '',
    availability_hour_debut: audience.availability
      ? formatTime(audience.availability.hour_debut)
      : '',
    availability_hour_end: audience.availability
      ? formatTime(audience.availability.hour_end)
      : '',
    request: audience.request ? audience.request._id : '',
    request_object: audience.request ? audience.request.object : '',
    request_creation: audience.request
      ? formatDate(audience.request.request_creation)
      : '',
    request_type: audience.request ? audience.request.type_request : '',
  }));
};

export const mapSingleAudience = (audience: any) => {
  return {
    _id: audience._id,
    ref_audience: audience.ref_audience,
    status_audience: audience.status_audience,
    user: audience.user ? audience.user._id : '',
    user_nom: audience.user ? audience.user.nom : '',
    user_prenom: audience.user ? audience.user.prenom : '',
    user_email: audience.user ? audience.user.email : '',
    user_cni: audience.user ? audience.user.cni : '',
    user_adresse: audience.user ? audience.user.adresse : '',
    user_telephone: audience.user ? audience.user.telephone : '',
    user_profile_photo: audience.user ? audience.user.profile_photo : '',
    availability: audience.availability ? audience.availability._id : '',
    availability_date: audience.availability
      ? formatDate(audience.availability.date_availability)
      : '',
    availability_hour_debut: audience.availability
      ? formatTime(audience.availability.hour_debut)
      : '',
    availability_hour_end: audience.availability
      ? formatTime(audience.availability.hour_end)
      : '',
    request: audience.request ? audience.request._id : '',
    request_object: audience.request ? audience.request.object : '',
    request_type: audience.request ? audience.request.type_request : '',
    request_creation: audience.request
      ? formatDate(audience.request.request_creation)
      : '',
    request_date_wanted_debut_initial: audience.request
      ? audience.request.date_wanted_debut
      : '',
    request_date_wanted_end_initial: audience.request
      ? audience.request.date_wanted_end
      : '',
    date_initial: audience.availability
      ? audience.availability.date_availability
      : '',
  };
};

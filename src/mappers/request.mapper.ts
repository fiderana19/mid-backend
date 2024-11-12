import { formatDate } from '../utils/dateformatter';

export const mapRequest = (requests: any) => {
  return requests.map((request) => ({
    user: request.user ? request.user._id : '',
    user_nom: request.user ? request.user.nom : '',
    user_prenom: request.user ? request.user.prenom : '',
    user_cni: request.user ? request.user.cni : '',
    user_adresse: request.user ? request.user.adresse : '',
    user_email: request.user ? request.user.email : '',
    user_telephone: request.user ? request.user.telephone : '',
    profile_photo: request.user ? request.user.profile_photo : '',
    _id: request._id,
    type_request: request.type_request,
    object: request.object,
    date_wanted_debut: formatDate(request.date_wanted_debut),
    date_wanted_end: formatDate(request.date_wanted_end),
    request_creation: formatDate(request.request_creation),
    status_request: request.status_request,
  }));
};

export const mapSingleRequest = (request: any) => {
  return {
    user: request.user ? request.user._id : '',
    user_nom: request.user ? request.user.nom : '',
    user_prenom: request.user ? request.user.prenom : '',
    user_cni: request.user ? request.user.cni : '',
    user_adresse: request.user ? request.user.adresse : '',
    user_email: request.user ? request.user.email : '',
    user_telephone: request.user ? request.user.telephone : '',
    profile_photo: request.user ? request.user.profile_photo : '',
    _id: request._id,
    type_request: request.type_request,
    object: request.object,
    date_wanted_debut: formatDate(request.date_wanted_debut),
    date_wanted_end: formatDate(request.date_wanted_end),
    request_creation: formatDate(request.request_creation),
    status_request: request.status_request,
    debut_initial: request.date_wanted_debut,
    end_initial: request.date_wanted_end,
  };
};

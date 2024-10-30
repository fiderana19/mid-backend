import { formatDate } from 'src/utils/dateformatter';

export const mapUser = (users: any) => {
  return users.map((user) => ({
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    date_naissance: formatDate(user.date_naissance),
    lieu_naissance: user.lieu_naissance,
    cni: user.cni,
    date_cni: formatDate(user.date_cni),
    lieu_cni: user.lieu_cni,
    user_creation: formatDate(user.user_creation),
    validation: user.validation,
  }));
};

export const mapSingleUser = (user: any) => {
  return {
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    date_naissance: formatDate(user.date_naissance),
    lieu_naissance: user.lieu_naissance,
    cni: user.cni,
    date_cni: formatDate(user.date_cni),
    lieu_cni: user.lieu_cni,
    user_creation: formatDate(user.user_creation),
    validation: user.validation,
  };
};

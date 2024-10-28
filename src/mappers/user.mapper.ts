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
    }))
}

export function formatDate(date: Date) {
    let yyyy = date.getFullYear()
    let mm = date.getMonth()+1 // JS months are 0 indexed, 0 = January, 11 = December
    let dd = date.getDate()

    let hh = date.getHours()
    let min = date.getMinutes()
    let ss = date.getSeconds()

    return dd+'-'+mm+'-'+yyyy;
}
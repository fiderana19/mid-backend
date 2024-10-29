export const mapRequest = (requests: any) => {
    return requests.map((request) => ({
        user_nom: request.user ? request.user.nom : '',
        user_prenom: request.user ? request.user.prenom : '',
        user_cni: request.user ? request.user.cni : '',
        _id: request._id,
        type_request: request.type_request,
        object: request.object,
        date_wanted_debut: formatDate(request.date_wanted_debut),
        date_wanted_end: formatDate(request.date_wanted_end),
        request_creation: formatDate(request.request_creation),
        status_request: request.status_request,
    }));
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
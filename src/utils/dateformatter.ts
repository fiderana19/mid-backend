export const formatDate = (date: Date) => {
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // JS months are 0 indexed, 0 = January, 11 = December
  let dd = date.getDate();

  let hh = date.getHours();
  let min = date.getMinutes();
  let ss = date.getSeconds();

  return dd + '-' + mm + '-' + yyyy;
};

export const formatTime = (date: Date) => {
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // JS months are 0 indexed, 0 = January, 11 = December
  let dd = date.getDate();

  let hh = date.getHours();
  let min = date.getMinutes();
  let ss = date.getSeconds();

  return hh + ':' + min;
};

export const getTimeForCalcul = (date: Date) => {
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // JS months are 0 indexed, 0 = January, 11 = December
  let dd = date.getDate();

  let hh = date.getHours();
  let min = date.getMinutes();
  let ss = date.getSeconds();

  let t = date.getTime();

  const time = hh + '' + min;
  return t;
};

export function addHours(date, hours) {
  const dateCopy = new Date(date.getTime());
  const hoursToAdd = hours * 60 * 60 * 1000;
  dateCopy.setTime(date.getTime() + hoursToAdd);
  return dateCopy;
}
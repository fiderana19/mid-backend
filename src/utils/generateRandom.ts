import { now } from 'moment';

export function generateRandom6digits() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateRandomRef() {
  let length = 6;
  let date = new Date();
  date.toISOString();
  console.log(date);
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // JS months are 0 indexed, 0 = January, 11 = December
  let dd = date.getDate();
  console.log(yyyy, dd, mm);

  let hh = date.getHours();
  let min = date.getMinutes();
  let ss = date.getSeconds();
  console.log(hh, min, ss);

  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return yyyy + '' + mm + '' + dd + '' + hh + '' + min + '' + ss + '-' + result;
}

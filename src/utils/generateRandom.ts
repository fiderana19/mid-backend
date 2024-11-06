export function generateRandom6digits() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

export const reverseFormat = (date) => {
    let ar = date.split("-");
    return ar[2] + "-" + ar[1] + "-" + ar[0];
};
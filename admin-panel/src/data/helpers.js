import AxiosHelper from '../../../helper/AxiosHelper';


export const ucFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const strLimit = (string, limit) => {
    if (string !== undefined && string.length > limit) {
        return string.substring(0, limit) + "...";
    } else {
        return string
    }
}

export const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}

export const convertToSlug = text => {
    return text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
}
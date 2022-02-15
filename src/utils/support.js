import Cookie from "js-cookie";

const SupportKey = 'supportKey';

export function getSupport() {
    return Cookie.get(SupportKey);
}

export function setSupport(isSupport) {
    return Cookie.set(SupportKey, isSupport, {expire: 3});
}

export function setCookie(key, value, expires) {
    return Cookie.set(key, value, {expires: expires});
}

export function getCookie(key) {
    return Cookie.get(key);
}
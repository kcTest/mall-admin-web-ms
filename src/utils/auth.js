import Cookie from "js-cookie";

const TokenKey = 'loginToken';

export function getToken() {
    return Cookie.get(TokenKey);
}

export function removeToken() {
    return Cookie.remove(TokenKey);
}
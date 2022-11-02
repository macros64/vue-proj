export default class jwtHelper {
  // jwt data extract by https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  static getJwtData(token) {
    if (!token) return {};
    let jsonPayload = '{}';

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
    } catch {
      /* i don't wanna process errors here, but linter swears */
    }
    return JSON.parse(jsonPayload);
  }
}

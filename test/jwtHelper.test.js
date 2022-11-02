import jwtHelper from '../jwtHelper.js';

describe('JWTHelper tests', () => {
  it('decrypt valid token', () => {
    let validToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    /* token taken from jwt.io, data encrypted are: 
        {
            "sub": "1234567890",
            "name": "John Doe",
            "iat": 1516239022
        }*/

    let decrypted = jwtHelper.getJwtData(validToken);
    expect(decrypted.sub).toEqual('1234567890');
    expect(decrypted.name).toEqual('John Doe');
    expect(decrypted.iat).toEqual(1516239022);
  });

  it('decrypt empty token', () => {
    expect(jwtHelper.getJwtData(null)).toEqual({});
    expect(jwtHelper.getJwtData(undefined)).toEqual({});
    expect(jwtHelper.getJwtData('')).toEqual({});
  });

  it('decrypt invalid token', () => {
    expect(jwtHelper.getJwtData('12345')).toEqual({});
    expect(jwtHelper.getJwtData('12345.67890')).toEqual({});
  });
});

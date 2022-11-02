export default class WSBase {
  token;
  constructor(tk) {
    this.token = tk;
  }

  async httpGet(url) {
    const params = this.getFetchParams('GET');
    const res = await fetch(url, params);
    return this.parseResponse(res);
  }

  async httpPost(url, reqBody) {
    const params = this.getFetchParams('POST', reqBody);
    const res = await fetch(url, params);
    return await this.parseResponse(res);
  }

  async httpPut(url, reqBody) {
    const params = this.getFetchParams('PUT', reqBody);
    const res = await fetch(url, params);
    return await this.parseResponse(res, false, true);
  }

  async httpDelete(url) {
    const params = this.getFetchParams('DELETE');
    const res = await fetch(url, params);
    return await this.parseResponse(res, false, false);
  }

  // prepare headers for fetch()
  getFetchParams(mtd, body) {
    const retVal = {
      method: mtd,
      headers: {},
    };
    if (body) {
      retVal.headers['Content-Type'] = 'application/json;charset=utf-8';
      retVal.body = JSON.stringify(body);
    }
    // add auth
    if (this.token) {
      retVal.headers.Authorization = 'Bearer ' + this.token;
    }
    return retVal;
  }

  // parse fetch() response
  async parseResponse(resp, hasDataInResponse = true, needData = true) {
    const retVal = {
      status: resp.status,
      statusText: resp.statusText,
      ok: resp.ok,
    };
    if (resp.ok && needData) {
      retVal.data = hasDataInResponse ? await resp.json() : '{}';
    }
    return retVal;
  }
}

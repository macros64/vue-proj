import WSBase from '@/WSBase.js';
import AppSettings from '@/appSettings.js';

const baseUrl = AppSettings.CORE_ROOT_URL;
const buildingsUri = '/buildings';
const roomsUri = '/rooms';
const counterTypesUri = '/counterTypes';
const reportUri = '/report';
const loginUri = '/users/login';
const serversUri = '/scadaservers';
const commUri = '/scadacomms';
const commLinesUri = '/commlines';
const usrUri = '/users';
const svcUri = '/svc';

export default class S4WebServiceProxy extends WSBase {
  getBuildings(withRooms = false) {
    return this.httpGet(baseUrl + buildingsUri + (withRooms ? '?withRooms=true' : ''));
  }

  async getCounterTypes() {
    return await this.httpGet(baseUrl + counterTypesUri);
  }

  async getBuilding(id) {
    const resp = await this.httpGet(baseUrl + buildingsUri + '/' + id);
    if (resp.ok) {
      resp.data.rooms.sort((a, b) => {
        return a.number - b.number;
      });
    }
    return resp;
  }

  async saveBuilding(bld) {
    const uri = baseUrl + buildingsUri;
    const resp = await this[bld.id ? 'httpPut' : 'httpPost'](uri, bld);
    return resp;
  }

  async deleteBuilding(bld) {
    return await this.httpDelete(baseUrl + buildingsUri + '/' + bld.id);
  }

  async saveRoom(r) {
    const uri = baseUrl + roomsUri;
    const resp = await this[r.id ? 'httpPut' : 'httpPost'](uri, r);
    return resp;
  }

  async deleteRoom(r) {
    return await this.httpDelete(baseUrl + roomsUri + '/' + r.id);
  }

  async getReport() {
    return await this.httpGet(baseUrl + reportUri);
  }

  async tryLogin(uName, passwd) {
    const resp = await this.httpPost(baseUrl + loginUri, {
      login: uName,
      password: passwd,
    });
    if (resp.ok) {
      return resp.data;
    }
    return undefined;
  }

  async getServers() {
    return await this.httpGet(baseUrl + serversUri);
  }

  async getServersFull() {
    return await this.httpGet(baseUrl + serversUri + '/full');
  }

  async getServer(id) {
    return await this.httpGet(baseUrl + serversUri + '/' + id);
  }

  async saveServer(s) {
    const uri = baseUrl + serversUri;
    const resp = await this[s.id ? 'httpPut' : 'httpPost'](uri, s);
    return resp;
  }

  async deleteServer(s) {
    return await this.httpDelete(baseUrl + serversUri + '/' + s.id);
  }

  async getComms() {
    return await this.httpGet(baseUrl + commUri);
  }

  async getComm(id) {
    return await this.httpGet(baseUrl + commUri + '/' + id);
  }

  async saveComm(comm) {
    const uri = baseUrl + commUri;
    const resp = await this[comm.id ? 'httpPut' : 'httpPost'](uri, comm);
    return resp;
  }

  async deleteComm(comm) {
    return await this.httpDelete(baseUrl + commUri + '/' + comm.id);
  }

  async getCommLine(id) {
    return await this.httpGet(baseUrl + commLinesUri + '/' + id);
  }

  async saveCommLine(line) {
    const uri = baseUrl + commLinesUri + (line.id ? ('/' + line.id) : '');
    const resp = await this[line.id ? 'httpPut' : 'httpPost'](uri, line);
    return resp;
  }

  async deleteCommLine(line) {
    return await this.httpDelete(baseUrl + commLinesUri + '/' + line.id);
  }

  async getUsers() {
    return await this.httpGet(baseUrl + usrUri);
  }

  async saveUser(usr) {
    const uri = baseUrl + usrUri + (usr.id ? ('/' + usr.id) : '');
    const resp = await this[usr.id ? 'httpPut' : 'httpPost'](uri, usr);
    return resp;
  }

  async lockUser(usr) {
    const uri = baseUrl + usrUri + '/' + usr.id + '/lock';
    return await this.httpPut(uri);
  }

  async unlockUser(usr) {
    const uri = baseUrl + usrUri + '/' + usr.id + '/unlock';
    return await this.httpPut(uri);
  }

  async setUserPassword(usr, pwd) {
    const uri = baseUrl + usrUri + '/' + usr.id + '/setpwd';
    return await this.httpPut(uri, pwd);
  }

  async getCoreBuldInfo() {
    const uri = baseUrl + svcUri + '/build-info';
    return await this.httpGet(uri);
  }
}

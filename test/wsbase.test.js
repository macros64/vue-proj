import WSBase from '../WSBase.js';

require('jest-fetch-mock').enableMocks();

beforeEach(() => {
  //fetchMock.doMock();
  fetchMock.resetMocks();
});

describe('WSBase tests', () => {
  it('get ok', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ some: 1 }));
    const ws = new WSBase();
    const resp = await ws.httpGet('https://some.url.com');
    expect(resp.ok).toBeTruthy();
    expect(resp.status).toBe(200);
  });

  it('post ok', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ some: 1 }));
    const ws = new WSBase();
    const resp = await ws.httpPost('https://some.url.com', { some: 2 });
    expect(resp.ok).toBeTruthy();
    expect(resp.status).toBe(200);
  });

  it('put ok', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ some: 1 }));
    const ws = new WSBase();
    const resp = await ws.httpPut('https://some.url.com', { some: 2 });
    expect(resp.ok).toBeTruthy();
    expect(resp.status).toBe(200);
  });

  it('delete ok', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ some: 1 }));
    const ws = new WSBase();
    const resp = await ws.httpDelete('https://some.url.com');
    expect(resp.ok).toBeTruthy();
    expect(resp.status).toBe(200);
  });
});

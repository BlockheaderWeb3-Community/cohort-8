const BASE_URL = 'http://localhost:5500/api/v1';

const unwrap = async (promise) => {
  const res = await promise;

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }

  const json = await res.json();
  return json.data;
};

export const getLatestBlock = () => unwrap(fetch(`${BASE_URL}/blocks/latest`));

export const getRecentBlocks = () => unwrap(fetch(`${BASE_URL}/blocks/recent`));

export const getBlockById = (id) => unwrap(fetch(`${BASE_URL}/blocks/${id}`));

export const getRecentTxns = () => unwrap(fetch(`${BASE_URL}/txns/recent`));

export const getTxnByHash = (hash) => unwrap(fetch(`${BASE_URL}/txns/${hash}`));

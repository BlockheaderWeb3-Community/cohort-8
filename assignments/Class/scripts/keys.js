import { generatePrivateKey } from 'viem/accounts';
import { privateKeyToAccount } from 'viem/accounts';

const pk = generatePrivateKey();
const account = privateKeyToAccount(pk);
console.log(pk);
console.log(account.address);


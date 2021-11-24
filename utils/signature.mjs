import ethUtils from 'ethereumjs-util';

const contract = 'CONTRACT';
const account = 'ACCOUNT';

const pk = Buffer.from('PK', 'hex');

const data = Buffer.from(
  contract.padStart(64, '0') +
    '0'.padStart(64, '0') +
    account.padStart(64, '0'),
  'hex'
);
const dataHash = ethUtils.sha3(data);
const messageHash = ethUtils.hashPersonalMessage(ethUtils.toBuffer(dataHash));
let vrs = ethUtils.ecsign(messageHash, pk);

console.log(
  Buffer.from(vrs.r).toString('hex'),
  Buffer.from(vrs.s).toString('hex'),
  vrs.v
);

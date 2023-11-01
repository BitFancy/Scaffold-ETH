export const contractAddresses = {
  1: {
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    Vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    BalancerQueries: '0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5',
  },
  31337: {
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    Vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    BalancerQueries: '0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5',
  },
  137: {
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  },
} as Partial<Record<number, Partial<Record<'DAI' | 'Vault' | 'BalancerQueries', string>>>>;

export type Pool = {
    address: string;
    poolId: string;
    symbol: string;
    name: string;
    owner: string;
    totalSupply: string;
    swapFeePercentage: string;
    inRecoveryMode: boolean;
    vaultAddress: string;
    poolTokens: PoolToken[];
}

export type PoolToken = {
    address: string;
    symbol: string;
    decimals: number;
    balance: string;
}

export type PoolTokenWithUserBalance = PoolToken & {
    userBalance: string;
}

export type PoolUserDataType = PoolUserDataUint256 | PoolUserDataUint256Array;

export type PoolUserDataUint256 = {
    type: 'uint256';
    value: string;
}

export type PoolUserDataUint256Array = {
    type: 'uint256[]';
    value: string[];
}

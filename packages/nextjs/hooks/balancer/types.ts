import { Address } from "viem";

export type Pool = {
    address: Address;
    poolId: `0x${string}`;
    symbol: string;
    name: string;
    owner: Address;
    totalSupply: string;
    swapFeePercentage: string;
    inRecoveryMode: boolean;
    vaultAddress: Address;
    poolTokens: PoolToken[];
}

export type PoolToken = {
    address: Address;
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

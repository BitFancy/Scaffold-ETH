import type { Pool } from './types';

import { formatUnits } from 'viem';
import { erc20ABI, usePublicClient, useQuery } from 'wagmi';

import { contractAddresses } from './contractAddresses';
import { BasePoolAbi } from './BasePoolAbi';
import { VaultAbi } from './VaultAbi';


export const usePoolContract = (poolAddress: string) => {
  const client = usePublicClient();

  const vaultAddress = contractAddresses[client.chain.id]?.Vault;

  return useQuery<Pool>(
    ['PoolContract', poolAddress, vaultAddress],
    async () => {
      // const [
      //   poolId,
      //   symbol,
      //   name,
      //   owner,
      //   totalSupply,
      //   swapFeePercentage,
      //   vaultAddress,
      // ] = Promise.all(
      //   ([
      //     'getPoolId',
      //     'symbol',
      //     'name',
      //     'getOwner',
      //     'totalSupply',
      //     'getSwapFeePercentage',
      //     'getVault',
      //   ] as const).map(async functionName => (
      //     await client.readContract({
      //       abi: BasePoolAbi,
      //       address: poolAddress,
      //       functionName,
      //     })
      //   ))
      // );

      const [
        poolId,
        symbol,
        name,
        owner,
        totalSupply,
        swapFeePercentage,
        vaultAddress,
      ] = await Promise.all([
        client.readContract({
          abi: BasePoolAbi,
          address: poolAddress,
          functionName: 'getPoolId',
        }),
        client.readContract({
          abi: BasePoolAbi,
          address: poolAddress,
          functionName: 'symbol',
        }),
        client.readContract({
          abi: BasePoolAbi,
          address: poolAddress,
          functionName: 'name',
        }),
        client.readContract({
          abi: BasePoolAbi,
          address: poolAddress,
          functionName: 'getOwner',
        }),
        client.readContract({
          abi: BasePoolAbi,
          address: poolAddress,
          functionName: 'totalSupply',
        }),
        client.readContract({
          abi: BasePoolAbi,
          address: poolAddress,
          functionName: 'getSwapFeePercentage',
        }),
        client.readContract({
          abi: BasePoolAbi,
          address: poolAddress,
          functionName: 'getVault',
        }),
      ]);

      const [
        poolTokens,
        poolBalances,
        lastChangeBlock,
      ] = await client.readContract({
        abi: VaultAbi,
        address: vaultAddress,
        functionName: 'getPoolTokens',
        args: [
          poolId,
        ]
      });

      const poolTokensWithBalances = Array.from({ length: poolBalances.length }, (_, i) => ({
        tokenAddress: poolTokens[i],
        tokenBalance: poolBalances[i],
      }));

      // Properties not supported by all pools
      const inRecoveryMode = await client.readContract({
        abi: BasePoolAbi,
        address: poolAddress,
        functionName: 'inRecoveryMode',
      }).catch(() => false)

      return {
        address: poolAddress,
        poolId,
        symbol,
        name,
        owner,
        totalSupply: formatUnits(totalSupply, 18),
        swapFeePercentage: formatUnits(swapFeePercentage, 16),
        inRecoveryMode,
        vaultAddress,
        poolTokens: await Promise.all(poolTokensWithBalances.map(async ({ tokenAddress, tokenBalance }) => {
          const [
            symbol,
            decimals,
          ] = await Promise.all([
            client.readContract({
              abi: erc20ABI,
              address: tokenAddress,
              functionName: 'symbol',
            }),
            client.readContract({
              abi: erc20ABI,
              address: tokenAddress,
              functionName: 'decimals',
            }),
          ]);

          return {
            address: tokenAddress,
            symbol,
            decimals,
            balance: formatUnits(tokenBalance, decimals),
          };
        })),
      } satisfies Pool;
    },
    { enabled: vaultAddress !== undefined }
  );
};

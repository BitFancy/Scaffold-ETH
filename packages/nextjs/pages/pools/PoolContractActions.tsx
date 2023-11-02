import type { Pool } from "~~/hooks/balancer/types";

import { useState } from "react";
import { Address, useAccount, useContractRead, usePublicClient } from "wagmi";

import { maxUint256 } from "viem";
import { IntegerInput } from "~~/components/scaffold-eth";
import { BalancerQueriesAbi } from "~~/hooks/balancer/BalancerQueriesAbi";
import { VaultAbi } from "~~/hooks/balancer/VaultAbi";
import { contractAddresses } from "~~/hooks/balancer/contractAddresses";

import { CustomWriteOnlyFunctionForm } from "./CustomWriteOnlyFunctionForm";


enum Action {
  Swap = 'swap',
  Join = 'join',
  Exit = 'exit',
}

enum SwapType {
  GivenIn = 'Given In',
  GivenOut = 'Given Out',
}

const SwapForm = ({
  pool,
  vaultAddress,
}: {
  pool: Pool
  vaultAddress: Address,
}) => {
  const publicClient = usePublicClient();

  const { address: accountAddress } = useAccount() as { address: Address };
  const { poolId } = pool;
  const [swapType, setSwapType] = useState(SwapType.GivenIn);
  const [tokenIn, setTokenIn] = useState<Address>(pool.poolTokens[0].address);
  const [tokenInAmount, setTokenInAmount] = useState<bigint>(0n);
  const [tokenOut, setTokenOut] = useState<Address>(pool.poolTokens[1].address);
  const [tokenOutAmount, setTokenOutAmount] = useState<bigint>(0n);

  const balancerQueriesAddress = contractAddresses[publicClient.chain.id].BalancerQueries

  const querySwapQuery = useContractRead({
    account: accountAddress,
    address: balancerQueriesAddress,
    abi: BalancerQueriesAbi,
    functionName: 'querySwap',
    args: [
      {
        poolId,
        kind: swapType === SwapType.GivenIn ? 0 : 1,
        assetIn: tokenIn,
        assetOut: tokenOut,
        amount: swapType === SwapType.GivenIn ? tokenInAmount : tokenOutAmount,
        userData: '0x',
      },
      {
        sender: accountAddress,
        fromInternalBalance: false,
        recipient: accountAddress,
        toInternalBalance: false,
      },
    ],
  })

  return (
    <CustomWriteOnlyFunctionForm
      {...{
        account: accountAddress,
        address: vaultAddress,
        abi: VaultAbi,
        functionName: 'swap',
        args: [
          {
            poolId,
            kind: swapType === SwapType.GivenIn ? 0 : 1,
            assetIn: tokenIn,
            assetOut: tokenOut,
            amount: swapType === SwapType.GivenIn ? tokenInAmount : tokenOutAmount,
            userData: '0x',
          },
          {
            sender: accountAddress,
            fromInternalBalance: false,
            recipient: accountAddress,
            toInternalBalance: false,
          },
          swapType === SwapType.GivenIn ? 0n : maxUint256,
          maxUint256,
        ]
      }}
      isValid={!querySwapQuery.isError && !!querySwapQuery.data && querySwapQuery.data > 0n}
    >
      <h3 className="text-lg font-bold">Swap</h3>

      <label>
        <span>Swap Type</span>
        <select
          className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent px-3 py-2"
          onChange={e => setSwapType(e.target.value as SwapType)}
        >
          {
            Object.values(SwapType).map((swapType) => (
              <option key={swapType} value={swapType}>{swapType}</option>
            ))
          }
        </select>
      </label>

      <label>
        <span>Token In</span>

        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <select
            className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent px-3 py-2"
            onChange={e => setTokenIn(e.target.value as Address)}
          >
            {pool.poolTokens.map((token) => (
              <option
                key={token.address}
                value={token.address}
              // disabled={token.address === tokenOut}
              >{token.symbol}</option>
            ))}
          </select>

          {swapType === SwapType.GivenIn ? (
            <IntegerInput
              value={tokenInAmount}
              onChange={setTokenInAmount}
              placeholder="0"
            />
          ) : (
            <span>
              {querySwapQuery.isSuccess ? (
                querySwapQuery.data!.toString()
              ) : querySwapQuery.isLoading ? (
                'Estimating...'
              ) : (
                ''
              )}
            </span>
          )}
        </div>
      </label>

      <label>
        <span>Token Out</span>

        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <select
            className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent px-3 py-2"
            onChange={e => setTokenOut(e.target.value as Address)}
          >
            {pool.poolTokens.map((token) => (
              <option
                key={token.address}
                value={token.address}
              // disabled={token.address === tokenIn}
              >{token.symbol}</option>
            ))}
          </select>

          {swapType === SwapType.GivenOut ? (
            <IntegerInput
              value={tokenOutAmount}
              onChange={setTokenOutAmount}
              placeholder="0"
            />
          ) : (
            <span>{querySwapQuery.isSuccess ? querySwapQuery.data!.toString() : querySwapQuery.isLoading ? 'Estimating...' : ''}</span>
          )}
        </div>
      </label>
    </CustomWriteOnlyFunctionForm>
  )
}

const JoinForm = ({
  pool,
  vaultAddress,
}: {
  pool: Pool
  vaultAddress: Address,
}) => {
  return (
    <form />
  )
}

const ExitForm = ({
  pool,
  vaultAddress,
}: {
  pool: Pool
  vaultAddress: Address,
}) => {
  return (
    <form />
  )
}

export const PoolContractActions = ({
  pool
}: {
  pool: Pool
}) => {
  const [action, setAction] = useState(Action.Swap);

  const publicClient = usePublicClient();

  const vaultAddress = contractAddresses[publicClient.chain.id]?.Vault;

  return (
    vaultAddress ? (
      action === Action.Swap ? (
        <SwapForm
          pool={pool}
          vaultAddress={vaultAddress}
        />
      ) : action === Action.Join ? (
        <JoinForm
          pool={pool}
          vaultAddress={vaultAddress}
        />
      ) : action === Action.Exit ? (
        <ExitForm
          pool={pool}
          vaultAddress={vaultAddress}
        />
      ) : (
        null
      )
    ) : (
      null
    )
  )
}

import { usePoolContract } from '../../hooks/balancer/usePoolContract';

import { Fragment } from 'react';
import { Address } from '~~/components/scaffold-eth';
import { PoolContractActions } from './PoolContractActions';


export const PoolContract = ({
  poolAddress
}: {
  poolAddress: string;
}) => {
  const { data: pool } = usePoolContract(poolAddress);

  return (
    <article className="grid grid-flow-col items-start gap-6 bg-base-100 p-6 rounded-2xl">
      <div className='grid grid-flow-row gap-4'>
        <header>
          <div>
            <h3 className='text-lg'>
              <strong>{pool?.name}</strong>{' '}
              <span>({pool?.symbol})</span>
            </h3>
          </div>
        </header>

        <dl className='grid grid-cols-[auto_1fr] gap-y-6 gap-x-6'>
          <dt className="font-bold">ID</dt>
          <dd>{pool?.poolId}</dd>

          <dt className="font-bold">Address</dt>
          <dd><Address address={pool?.address} /></dd>

          <dt className="font-bold">Owner</dt>
          <dd><Address address={pool?.owner} /></dd>

          <dt className="font-bold">Pool tokens</dt>
          <dd>
            <div className='grid grid-cols-[1fr_auto] gap-3 gap-x-6'>
              {pool?.poolTokens.map((token) => (
                <Fragment key={token.address}>
                  <span>{`${token.balance} ${token.symbol}`}</span>
                  <Address address={token.address} />
                </Fragment>
              ))}
            </div>
          </dd>

          <dt className="font-bold">Swap fee percentage</dt>
          <dd>
            {pool?.swapFeePercentage}%
          </dd>

          <dt className="font-bold">Total supply</dt>
          <dd>
            {pool?.totalSupply}
          </dd>

          <dt className="font-bold">Vault</dt>
          <dd>
            <Address address={pool?.vaultAddress} />
          </dd>
        </dl>
      </div>

      {pool &&
        <PoolContractActions
          pool={pool}
        />
      }
    </article>
  );
}

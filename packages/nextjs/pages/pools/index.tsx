import { type Address, isAddress } from "viem";

import { Fragment, useState } from "react";
import { AddressInput } from "~~/components/scaffold-eth";
import { PoolContract } from "./PoolContract";

export default function () {
  const [poolAddress, setPoolAddress] = useState<Address>('');
  const [poolContracts, setPoolContracts] = useState<Address[]>([]);

  const isValid = isAddress(poolAddress);

  return (
    <>
      <section className="flex items-center flex-col py-10 px-5 mx-auto max-w-[800px]">
        <h2 className="block text-4xl font-bold">Pools</h2>
        <p>
          Balancer is infinitely extensible to allow for any conceivable pool type with custom curves, logic, parameters, and more. Each pool deployed to balancer is its own smart contract. This tool allows you to interact with any pool currently deployed (custom or existing). To get started, enter the contract address of the desired pool below. To deploy any custom pools you've created in <code>scaffold-balancer</code>, add a deployment script in <code>solidity-ts/deploy/hardhat-deploy/</code> and run{' '} <code>yarn deploy</code> in a new terminal window.
        </p>
        <hr />
      </section >

      <section className="flex items-center flex-col flex-grow pt-10">
        <form
          className="flex flex-row items-center gap-2" onSubmit={(event) => {
            event.preventDefault();
            setPoolContracts([...poolContracts, poolAddress]);
            setPoolAddress('');
          }}>
          <AddressInput
            value={poolAddress}
            onChange={setPoolAddress}
            placeholder={'Pool contract address'}
          />
          <button
            className="btn btn-sm btn-primary" type="submit"
            disabled={!isValid}
          >
            Add pool contract
          </button>
        </form>
      </section>

      <section className="flex items-center flex-col flex-grow pt-10">
        {poolContracts.map(poolAddress => (
          <Fragment key={poolAddress}>
            <PoolContract poolAddress={poolAddress} />
          </Fragment>
        ))}
      </section>
    </>
  )
}

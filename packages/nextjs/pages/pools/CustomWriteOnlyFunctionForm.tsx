import type { Abi } from "abitype";
import { Chain, SimulateContractParameters, getAbiItem } from "viem";

import { type Dispatch, type SetStateAction, Fragment, useEffect, useState } from "react"
import { WriteOnlyFunctionForm, getFunctionInputKey, getInitialFormState } from "~~/components/scaffold-eth"

export const CustomWriteOnlyFunctionForm = <
  TChain extends Chain | undefined,
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TChainOverride extends Chain | undefined,
>({
  abi,
  address: contractAddress,
  functionName,
  args,
  children
}: {
  formState: [Record<string, any>, Dispatch<SetStateAction<Record<string, any>>>],
  children: React.ReactNode,
} & SimulateContractParameters<TAbi, TFunctionName, TChain, TChainOverride>) => {
  const abiFunction = getAbiItem({
    abi,
    args,
    name: functionName,
  })

  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction))

  useEffect(() => {
    setForm({
      ...form,
      ...Object.fromEntries(
        args.map((arg, i) => [
          getFunctionInputKey(abiFunction.name, abiFunction.inputs[i], i),
          typeof arg === 'bigint' ? arg.toString() : JSON.stringify(arg, (key, value) => typeof value === 'bigint' ? value.toString() : value),
        ])
      )
    })
  }, [args])

  return (
    <Fragment>
      {children}

      <WriteOnlyFunctionForm
        abiFunction={abiFunction}
        contractAddress={contractAddress}
        onChange={() => console.log('onChange')}
        formState={[form, setForm]}
      />
    </Fragment>
  )
}

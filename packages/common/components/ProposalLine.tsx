import Link from 'next/link'
import { ComponentType } from 'react'

import { SuspenseLoader } from '@dao-dao/common'
import {
  ProposalModuleAdapterProvider,
  useProposalModuleAdapter,
  useProposalModuleAdapterOptions,
} from '@dao-dao/proposal-module-adapter'
import { ProposalModule } from '@dao-dao/tstypes'
import {
  Loader as DefaultLoader,
  Logo as DefaultLogo,
  LoaderProps,
  LogoProps,
  ProposalLineLoader,
} from '@dao-dao/ui'

export interface ProposalLineProps {
  coreAddress: string
  proposalModules: ProposalModule[]
  proposalId: string
  proposalViewUrl: string
  Logo?: ComponentType<LogoProps>
  Loader?: ComponentType<LoaderProps>
}

export const ProposalLine = ({
  coreAddress,
  proposalModules,
  proposalId,
  Logo = DefaultLogo,
  Loader = DefaultLoader,
  ...props
}: ProposalLineProps) => (
  <ProposalModuleAdapterProvider
    ProviderLoader={() => <ProposalLineLoader Loader={Loader} />}
    initialOptions={{
      coreAddress,
      Logo,
      Loader,
    }}
    proposalId={proposalId}
    proposalModules={proposalModules}
  >
    <InnerProposalLine {...props} />
  </ProposalModuleAdapterProvider>
)

type InnerProposalLineProps = Pick<ProposalLineProps, 'proposalViewUrl'>

const InnerProposalLine = ({ proposalViewUrl }: InnerProposalLineProps) => {
  const {
    components: { ProposalLine },
  } = useProposalModuleAdapter()
  const { Loader } = useProposalModuleAdapterOptions()

  return (
    <SuspenseLoader fallback={<ProposalLineLoader Loader={Loader} />}>
      <Link href={proposalViewUrl}>
        <ProposalLine />
      </Link>
    </SuspenseLoader>
  )
}
import {
  AccountCircleOutlined,
  AnalyticsOutlined,
  CopyAllOutlined,
  HourglassTopRounded,
  ListAltRounded,
  RotateRightOutlined,
} from '@mui/icons-material'
import clsx from 'clsx'
import { ComponentType, Fragment, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IProposalModuleAdapterOptions } from '@dao-dao/proposal-module-adapter'
import { formatDate } from '@dao-dao/utils'

import {
  Button,
  ButtonLink,
  CopyToClipboardUnderline,
  CosmosMessageDisplay,
  MarkdownPreview,
  PageHeader,
  ProposalIdDisplay,
  useAppLayoutContext,
} from '../components'

export interface ProposalProps {
  voteStatus: string
  voteTally: ReactNode
  votesCast: ReactNode
  proposalStatus: string
  dao: {
    name: string
    address: string
  }
  creator: {
    name: string
    address: string
  }
  created: Date
  expiration: string
  title: string
  description: string
  decodedMessages: { [key: string]: any }[]
  actionList: ReactNode
  proposalModuleAdapterOptions: IProposalModuleAdapterOptions
  onDuplicate: () => void
  rightSidebarContent: ReactNode
}

export const Proposal = ({
  voteStatus,
  voteTally,
  votesCast,
  proposalStatus,
  dao,
  creator,
  created,
  expiration,
  title,
  description,
  decodedMessages,
  actionList,
  proposalModuleAdapterOptions: {
    proposalId,
    proposalNumber,
    proposalModule,
    Logo,
  },
  onDuplicate,
  rightSidebarContent,
}: ProposalProps) => {
  const { t } = useTranslation()
  const { RightSidebarContent } = useAppLayoutContext()

  const [showRaw, setShowRaw] = useState(false)

  const info: ProposalStatusAndInfoProps['info'] = [
    {
      Icon: ListAltRounded,
      label: t('title.proposal'),
      Value: (props) => (
        <p {...props}>
          <ProposalIdDisplay
            proposalNumber={proposalNumber}
            proposalPrefix={proposalModule.prefix}
          />
        </p>
      ),
    },
    {
      Icon: ({ className }) => (
        <Logo className={clsx('m-[0.125rem] !w-5 !h-5', className)} />
      ),
      label: t('title.dao'),
      Value: (props) => (
        <ButtonLink variant="underline" {...props}>
          {dao.name}
        </ButtonLink>
      ),
    },
    {
      Icon: AccountCircleOutlined,
      label: t('title.creator'),
      Value: (props) => (
        <CopyToClipboardUnderline
          takeStartEnd={{
            start: 6,
            end: 4,
          }}
          value={creator.address}
          {...props}
        />
      ),
    },
    {
      Icon: RotateRightOutlined,
      label: t('title.status'),
      Value: (props) => <p {...props}>{proposalStatus}</p>,
    },
    {
      Icon: HourglassTopRounded,
      label: t('title.timeLeft'),
      Value: (props) => <p {...props}>{expiration}</p>,
    },
  ]

  return (
    <>
      <RightSidebarContent>{rightSidebarContent}</RightSidebarContent>

      <div className="flex flex-col gap-10 items-stretch px-6 mx-auto max-w-5xl">
        <PageHeader
          breadcrumbs={{
            crumbs: [
              { href: '/home', label: 'Home' },
              { href: `/dao/${dao.address}`, label: dao.name },
            ],
            current: `${t('title.proposal')} ${proposalId}`,
          }}
        />

        <div className="grid grid-cols-1 gap-[3.5rem] md:grid-cols-[3fr,7fr]">
          <ProposalStatusAndInfo info={info} status={voteStatus} />

          <div>
            <p className="mb-11 hero-text">{title}</p>

            <p className="mb-4 font-mono caption-text">
              {`@${creator.name} – ${formatDate(created)}`}
            </p>

            <MarkdownPreview markdown={description} />

            {!!decodedMessages?.length && (
              <div className="my-9 space-y-3">
                {actionList}

                <div className="flex flex-row gap-7 items-center">
                  <Button onClick={() => setShowRaw((s) => !s)} variant="ghost">
                    <AnalyticsOutlined className="text-icon-secondary" />
                    <p className="secondary-text">
                      {showRaw
                        ? t('button.hideRawData')
                        : t('button.showRawData')}
                    </p>
                  </Button>

                  <Button onClick={onDuplicate} variant="ghost">
                    <CopyAllOutlined className="text-icon-secondary" />
                    <p className="secondary-text">{t('button.duplicate')}</p>
                  </Button>
                </div>

                {showRaw && (
                  <CosmosMessageDisplay
                    value={JSON.stringify(decodedMessages, undefined, 2)}
                  />
                )}
              </div>
            )}

            <ProposalStatusAndInfo info={info} inline status={voteStatus} />

            {voteTally}

            <div className="mt-10">{votesCast}</div>
          </div>
        </div>
      </div>
    </>
  )
}

interface ProposalStatusAndInfoProps {
  status: string
  info: {
    Icon: ComponentType<{ className: string }>
    label: string
    Value: ComponentType<{ className: string }>
  }[]
  inline?: boolean
}

const ProposalStatusAndInfo = ({
  status,
  info,
  inline = false,
}: ProposalStatusAndInfoProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={clsx(
        inline
          ? 'mb-4 bg-background-tertiary rounded-lg border border-border-secondary md:hidden'
          : 'hidden md:block'
      )}
    >
      <div className={clsx('flex flex-col gap-4', inline ? 'p-6' : 'pb-10')}>
        <div className="flex flex-row gap-3 items-center">
          <AnalyticsOutlined className="w-6 h-6 text-icon-secondary" />
          <p className="secondary-text">{t('title.status')}</p>
        </div>

        {/* TODO: const helpfulStatusText =
          proposal.status === Status.Open && threshold && quorum
            ? thresholdReached && quorumMet
              ? 'If the current vote stands, this proposal will pass.'
              : !thresholdReached && quorumMet
              ? "If the current vote stands, this proposal will fail because insufficient 'Yes' votes have been cast."
              : thresholdReached && !quorumMet
              ? 'If the current vote stands, this proposal will fail due to a lack of voter participation.'
              : undefined
            : undefined */}
        <p className="text-text-secondary body-text">{status}</p>
      </div>

      <div
        className={clsx(
          'grid grid-cols-2 gap-3 items-center border-t border-border-secondary',
          inline ? 'p-6' : 'py-8 border-b'
        )}
      >
        {info.map(({ Icon, label, Value }, index) => (
          <Fragment key={index}>
            <div className="flex flex-row gap-3 items-center">
              <Icon className="w-6 h-6 text-icon-secondary" />
              <p className="secondary-text">{label}</p>
            </div>

            <Value className="!font-mono !text-base !font-medium !leading-5 text-left !text-text-body" />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
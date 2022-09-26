import { ComponentType, ReactNode } from 'react'
import { FieldError } from 'react-hook-form'

import { SuspenseLoader } from '@dao-dao/common'

import { InputErrorMessage } from '../../input'
import { Loader as DefaultLoader, LoaderProps } from '../../Loader'
import { TooltipInfoIcon } from '../../TooltipInfoIcon'

export interface DaoCreateConfigInputCardProps {
  Icon: ComponentType
  name: string
  description: string
  tooltip?: string
  input: ReactNode
  Loader?: ComponentType<LoaderProps>
  error?: FieldError
}

export const DaoCreateConfigInputCard = ({
  Icon,
  name,
  description,
  tooltip,
  input,
  Loader = DefaultLoader,
  error,
}: DaoCreateConfigInputCardProps) => (
  <div className="flex relative flex-col bg-background-tertiary rounded-lg">
    {tooltip && (
      <TooltipInfoIcon className="absolute top-3 right-3" title={tooltip} />
    )}

    <div className="flex justify-center items-center h-32 text-6xl border-b border-border-secondary">
      <Icon />
    </div>

    <div className="flex flex-col grow gap-12 justify-between p-6">
      <div className="space-y-3">
        <p className="text-text-body primary-text">{name}</p>
        <p className="text-text-secondary body-text">{description}</p>
      </div>

      <div className="flex flex-col">
        <SuspenseLoader fallback={<Loader />}>{input}</SuspenseLoader>
        <InputErrorMessage error={error} />
      </div>
    </div>
  </div>
)
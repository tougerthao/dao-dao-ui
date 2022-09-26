import { CosmosMsg_for_Empty } from '@dao-dao/state/clients/cw-proposal-single'
import {
  ActionKeyAndData,
  DurationWithUnits,
  ProcessedTQ,
} from '@dao-dao/tstypes'

export interface NewProposalForm {
  title: string
  description: string
  actionData: ActionKeyAndData[]
}

// Converted data from actions into Cosmos messages.
export interface NewProposalData extends Omit<NewProposalForm, 'actionData'> {
  msgs: CosmosMsg_for_Empty[]
}

export interface ThresholdValue {
  majority: boolean
  // Will be used when `majority` is false.
  value: number
}

export interface DaoCreationConfig {
  threshold: ThresholdValue
  quorumEnabled: boolean
  quorum: ThresholdValue
  votingDuration: DurationWithUnits
  proposalDeposit: {
    amount: number
    refundFailed: boolean
  }
  allowRevoting: boolean
}

export interface VotesInfo {
  threshold: ProcessedTQ
  quorum?: ProcessedTQ
  // Raw info
  yesVotes: number
  noVotes: number
  abstainVotes: number
  totalVotingPower: number
  turnoutTotal: number
  // Turnout percents
  turnoutPercent: number
  turnoutYesPercent: number
  turnoutNoPercent: number
  turnoutAbstainPercent: number
  // Total percents
  totalYesPercent: number
  totalNoPercent: number
  totalAbstainPercent: number
  // Meta
  thresholdReached: boolean
  quorumReached: boolean
}
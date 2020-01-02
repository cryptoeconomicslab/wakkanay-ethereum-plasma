import { BigNumber, Bytes } from 'wakkanay/dist/types'
import Transaction from './Transaction'
import { DoubleLayerInclusionProof } from 'wakkanay/dist/verifiers'
import StateUpdate from './StateUpdate'

export interface CheckpointElement {
  blockNumber: BigNumber
  checkpointId: Bytes
}

export interface StateUpdateElement {
  blockNumber: BigNumber
  transactions: Transaction[]
  inclusionProof: DoubleLayerInclusionProof
}

export interface NonInclusionElement {
  blockNumber: BigNumber
  stateUpdate: StateUpdate
  inclusionProof: DoubleLayerInclusionProof
}

export type HistoryProof = Array<
  CheckpointElement | StateUpdateElement | NonInclusionElement
>

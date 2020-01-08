import { types, verifiers } from 'wakkanay-ethereum'
import BigNumber = types.BigNumber
import Bytes = types.Bytes
import DoubleLayerInclusionProof = verifiers.DoubleLayerInclusionProof

import Transaction from './Transaction'
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

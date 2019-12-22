import { verifiers } from 'wakkanay'
import StateUpdate from './StateUpdate'
import Coder from '../Coder'
import { BigNumber, Address } from 'wakkanay/dist/types'

export default class Block {
  constructor(
    readonly blockNumber: BigNumber,
    readonly stateUpdatesMap: Map<Address, StateUpdate[]>
  ) {}

  public generateTree(): verifiers.DoubleLayerTree {
    let stateUpdates: StateUpdate[] = []
    this.stateUpdatesMap.forEach(v => {
      stateUpdates = [...stateUpdates, ...v]
    })
    const leaves = stateUpdates.map(s => {
      return new verifiers.DoubleLayerTreeLeaf(
        s.depositContractAddress,
        s.range.start,
        Coder.encode(s.property.toStruct())
      )
    })
    return new verifiers.DoubleLayerTree(leaves)
  }
}

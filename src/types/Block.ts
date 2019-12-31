import { verifiers } from 'wakkanay'
import StateUpdate from './StateUpdate'
import Coder from '../Coder'
import { Bytes, BigNumber, Struct, List } from 'wakkanay/dist/types'
import { Property } from 'wakkanay/dist/ovm'
import { Keccak256 } from 'wakkanay/dist/verifiers'

function generateLeaf(stateUpdate: StateUpdate): verifiers.DoubleLayerTreeLeaf {
  return new verifiers.DoubleLayerTreeLeaf(
    stateUpdate.depositContractAddress,
    stateUpdate.range.start,
    Keccak256.hash(Coder.encode(stateUpdate.property.toStruct()))
  )
}

export default class Block {
  private tree: verifiers.DoubleLayerTree | null = null

  constructor(
    readonly blockNumber: BigNumber,
    readonly stateUpdatesMap: Map<string, StateUpdate[]>
  ) {}

  public getTree(): verifiers.DoubleLayerTree {
    if (this.tree) return this.tree

    this.tree = this.generateTree()
    return this.tree
  }

  private generateTree(): verifiers.DoubleLayerTree {
    let stateUpdates: StateUpdate[] = []
    this.stateUpdatesMap.forEach(v => {
      stateUpdates = [...stateUpdates, ...v]
    })
    const leaves = stateUpdates.map(generateLeaf)
    console.log('leaves:', leaves)
    return new verifiers.DoubleLayerTree(leaves)
  }

  public getInclusionProof(
    stateUpdate: StateUpdate
  ): verifiers.DoubleLayerInclusionProof | null {
    const leaf = generateLeaf(stateUpdate)
    const tree = this.getTree()
    const i = tree.findIndex(leaf.encode())
    if (!i) return null

    const proof = tree.getInclusionProofByAddressAndIndex(
      stateUpdate.depositContractAddress,
      i
    )

    return proof
  }

  public static fromStruct(s: Struct): Block {
    const map = new Map()
    const tokenAddresses = s.data.tokenAddresses as List<Bytes>
    const stateUpdatesList = s.data.stateUpdatesList as List<List<Struct>>
    const blockNumber = s.data.blockNumber as BigNumber
    tokenAddresses.data.forEach((b: Bytes, i) => {
      const key = b.toHexString()
      map.set(
        key,
        stateUpdatesList.data[i].data.map(
          s => new StateUpdate(Property.fromStruct(s))
        )
      )
    })
    return new Block(blockNumber, map)
  }

  public toStruct(): Struct {
    const addrs = Array.from(this.stateUpdatesMap.keys())

    const stateUpdatesList = addrs.map(addr => {
      const stateUpdates = this.stateUpdatesMap.get(addr) || []
      const list = stateUpdates.map(s => s.property.toStruct())
      return List.from(
        {
          default: Property.getParamType
        },
        list
      )
    })

    return new Struct({
      blockNumber: this.blockNumber,
      tokenAddresses: List.from(Bytes, addrs.map(Bytes.fromHexString)),
      stateUpdatesList: List.from(
        {
          default: () =>
            List.default(
              {
                default: Property.getParamType
              },
              Property.getParamType()
            )
        },
        stateUpdatesList
      )
    })
  }

  public static getParamType(): Struct {
    return new Struct({
      blockNumber: BigNumber.default(),
      tokenAddresses: List.default(Bytes, Bytes.default()),
      stateUpdatesList: List.default(
        {
          default: () =>
            List.default(
              {
                default: Property.getParamType
              },
              Property.getParamType()
            )
        },
        List.from({ default: Property.getParamType }, [])
      )
    })
  }
}

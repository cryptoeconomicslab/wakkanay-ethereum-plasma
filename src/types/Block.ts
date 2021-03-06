import { types, ovm, verifiers } from 'wakkanay-ethereum'
import BigNumber = types.BigNumber
import Bytes = types.Bytes
import Struct = types.Struct
import List = types.List
import Property = ovm.Property
import Keccak256 = verifiers.Keccak256

import StateUpdate from './StateUpdate'
import Coder from '../Coder'

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

  public verifyInclusion(
    stateUpdate: StateUpdate,
    inclusionProof: verifiers.DoubleLayerInclusionProof
  ): boolean {
    const tree = this.getTree()
    const leaf = generateLeaf(stateUpdate)
    if (tree.findIndex(leaf.encode()) === null) {
      return false
    }
    const verifier = new verifiers.DoubleLayerTreeVerifier()
    return verifier.verifyInclusion(
      leaf,
      stateUpdate.range,
      tree.getRoot(),
      inclusionProof
    )
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
    const blockNumber = s.data[0].value as BigNumber
    const tokenAddresses = s.data[1].value as List<Bytes>
    const stateUpdatesList = s.data[2].value as List<List<Struct>>
    tokenAddresses.data.forEach((b: Bytes, i: number) => {
      const key = b.toHexString()
      map.set(
        key,
        stateUpdatesList.data[i].data.map(
          (s: Struct) => new StateUpdate(Property.fromStruct(s))
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

    return new Struct([
      {
        key: 'blockNumber',
        value: this.blockNumber
      },
      {
        key: 'tokenAddresses',
        value: List.from(Bytes, addrs.map(Bytes.fromHexString))
      },
      {
        key: 'stateUpdatesList',
        value: List.from(
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
      }
    ])
  }

  public static getParamType(): Struct {
    return new Struct([
      {
        key: 'blockNumber',
        value: BigNumber.default()
      },
      { key: 'tokenAddresses', value: List.default(Bytes, Bytes.default()) },
      {
        key: 'stateUpdatesList',
        value: List.default(
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
      }
    ])
  }
}

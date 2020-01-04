import { Address, Struct, BigNumber } from 'wakkanay/dist/types'
import { Property } from 'wakkanay/dist/ovm'

export default class StateUpdateRecord {
  constructor(
    readonly predicateAddress: Address,
    readonly depositContractAddress: Address,
    readonly blockNumber: BigNumber,
    readonly stateObject: Property
  ) {}

  /**
   * return empty instance of Transaction
   */
  public static default(): StateUpdateRecord {
    return new StateUpdateRecord(
      Address.default(),
      Address.default(),
      BigNumber.default(),
      new Property(Address.default(), [])
    )
  }

  public static getParamType(): Struct {
    return new Struct([
      { key: 'predicateAddress', value: Address.default() },
      { key: 'depositContractAddress', value: Address.default() },
      { key: 'blockNumber', value: BigNumber.default() },
      { key: 'stateObject', value: Property.getParamType() }
    ])
  }

  public static fromStruct(struct: Struct): StateUpdateRecord {
    return new StateUpdateRecord(
      struct.data[0].value as Address,
      struct.data[1].value as Address,
      struct.data[2].value as BigNumber,
      Property.fromStruct(struct.data[3].value as Struct)
    )
  }

  public toStruct(): Struct {
    return new Struct([
      { key: 'predicateAddress', value: this.predicateAddress },
      { key: 'depositContractAddress', value: this.depositContractAddress },
      { key: 'blockNumber', value: this.blockNumber },
      { key: 'stateObject', value: this.stateObject.toStruct() }
    ])
  }
}

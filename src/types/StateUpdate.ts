import { types, ovm, db, utils } from 'wakkanay-ethereum'
import Address = types.Address
import BigNumber = types.BigNumber
import Bytes = types.Bytes
import Range = types.Range
import Property = ovm.Property
import DecoderUtil = utils.DecoderUtil
import RangeRecord = db.RangeRecord

import StateUpdateRecord from './StateUpdateRecord'
import Coder from '../Coder'

/**
 * StateUpdate wrapper class
 * StateUpdate is a property with inputs type
 * [tokenAddress: Address, range: Range, block_number: uint256, stateObject: Property]
 */
export default class StateUpdate {
  public depositContractAddress: Address
  public range: Range
  public blockNumber: BigNumber
  public stateObject: Property

  constructor(public property: Property) {
    this.depositContractAddress = Coder.decode(
      Address.default(),
      property.inputs[0]
    )
    this.range = DecoderUtil.decodeStructable(Range, Coder, property.inputs[1])
    this.blockNumber = Coder.decode(BigNumber.default(), property.inputs[2])
    this.stateObject = DecoderUtil.decodeStructable(
      Property,
      Coder,
      property.inputs[3]
    )
  }

  public get amount(): bigint {
    return this.range.end.data - this.range.start.data
  }

  public get predicateAddress(): Address {
    return this.property.deciderAddress
  }

  public update({
    depositContractAddress,
    range,
    blockNumber,
    stateObject
  }: {
    depositContractAddress?: Address
    range?: Range
    blockNumber?: BigNumber
    stateObject?: Property
  }) {
    const property = this.property
    if (depositContractAddress) {
      this.depositContractAddress = depositContractAddress
      property.inputs[0] = Coder.encode(depositContractAddress)
    }
    if (range) {
      this.range = range
      property.inputs[1] = Coder.encode(range.toStruct())
    }
    if (blockNumber) {
      this.blockNumber = blockNumber
      property.inputs[2] = Coder.encode(blockNumber)
    }
    if (stateObject) {
      this.stateObject = stateObject
      property.inputs[3] = Coder.encode(stateObject.toStruct())
    }
  }

  public static fromRangeRecord(r: RangeRecord): StateUpdate {
    return StateUpdate.fromRecord(
      DecoderUtil.decodeStructable(StateUpdateRecord, Coder, r.value),
      new Range(r.start, r.end)
    )
  }

  public static fromRecord(
    record: StateUpdateRecord,
    range: Range
  ): StateUpdate {
    const inputs: Bytes[] = [
      record.depositContractAddress,
      range.toStruct(),
      record.blockNumber,
      record.stateObject.toStruct()
    ].map(Coder.encode)

    const property = new Property(record.predicateAddress, inputs)

    return new StateUpdate(property)
  }

  public toRecord(): StateUpdateRecord {
    return new StateUpdateRecord(
      this.property.deciderAddress,
      this.depositContractAddress,
      this.blockNumber,
      this.stateObject
    )
  }
}

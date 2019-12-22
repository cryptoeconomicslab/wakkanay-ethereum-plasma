import { Address, Struct, BigNumber, Range } from 'wakkanay/dist/types'
import { Property } from 'wakkanay/dist/ovm'

export default class Transaction {
  constructor(
    public depositContractAddress: Address,
    public range: Range,
    public stateObject: Property
  ) {}

  /**
   * return empty instance of StateUpdate
   */
  public static default(): Transaction {
    return new Transaction(
      Address.default(),
      new Range(BigNumber.default(), BigNumber.default()),
      new Property(Address.default(), [])
    )
  }

  public static getParamTypes(): Struct {
    return new Struct({
      depositContractAddress: Address.default(),
      range: new Struct({
        start: BigNumber.default(),
        end: BigNumber.default()
      }),
      stateObject: Property.getParamType()
    })
  }

  public static fromStruct(struct: Struct): Transaction {
    const { depositContractAddress, range, stateObject } = struct.data

    return new Transaction(
      depositContractAddress as Address,
      Range.fromStruct(range as Struct),
      Property.fromStruct(stateObject as Struct)
    )
  }

  public toStruct(): Struct {
    return new Struct({
      depositContractAddress: this.depositContractAddress,
      range: this.range.toStruct(),
      stateObject: this.stateObject.toStruct()
    })
  }
}

import { Address, Bytes, Struct, BigNumber, Range } from 'wakkanay/dist/types'
import { Property } from 'wakkanay/dist/ovm'
import { Keccak256 } from 'wakkanay/dist/verifiers'
import EthCoder from 'wakkanay-ethereum/dist/coder'

export default class Transaction {
  constructor(
    public depositContractAddress: Address,
    public range: Range,
    public stateObject: Property,
    public from: Address,
    public signature: Bytes = Bytes.default()
  ) {}

  /**
   * return empty instance of StateUpdate
   */
  public static default(): Transaction {
    return new Transaction(
      Address.default(),
      new Range(BigNumber.default(), BigNumber.default()),
      new Property(Address.default(), []),
      Address.default(),
      Bytes.default()
    )
  }

  public static getParamTypes(): Struct {
    return new Struct({
      depositContractAddress: Address.default(),
      range: new Struct({
        start: BigNumber.default(),
        end: BigNumber.default()
      }),
      stateObject: Property.getParamType(),
      from: Address.default(),
      signature: Bytes.default()
    })
  }

  public static fromStruct(struct: Struct): Transaction {
    const {
      depositContractAddress,
      range,
      stateObject,
      from,
      signature
    } = struct.data

    return new Transaction(
      depositContractAddress as Address,
      Range.fromStruct(range as Struct),
      Property.fromStruct(stateObject as Struct),
      from as Address,
      signature as Bytes
    )
  }

  public toStruct(): Struct {
    return new Struct({
      depositContractAddress: this.depositContractAddress,
      range: this.range.toStruct(),
      stateObject: this.stateObject.toStruct(),
      from: this.from,
      signature: this.signature
    })
  }

  public get body(): Struct {
    return new Struct({
      depositContractAddress: this.depositContractAddress,
      range: this.range.toStruct(),
      from: this.from,
      stateObject: this.stateObject.toStruct()
    })
  }

  public getHash(): Bytes {
    return Keccak256.hash(EthCoder.encode(this.body))
  }
}

import { ethCoder, types, ovm, verifiers } from 'wakkanay-ethereum'
import Address = types.Address
import BigNumber = types.BigNumber
import Bytes = types.Bytes
import Struct = types.Struct
import Range = types.Range
import Property = ovm.Property
import Keccak256 = verifiers.Keccak256
import EthCoder = ethCoder.EthCoder

export default class Transaction {
  constructor(
    public depositContractAddress: Address,
    public range: Range,
    public prevBlockNumber: BigNumber,
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
      BigNumber.default(),
      new Property(Address.default(), []),
      Address.default(),
      Bytes.default()
    )
  }

  public static getParamTypes(): Struct {
    return new Struct([
      { key: 'depositContractAddress', value: Address.default() },
      { key: 'range', value: Range.getParamType() },
      { key: 'prevBlockNumber', value: BigNumber.default() },
      { key: 'stateObject', value: Property.getParamType() },
      { key: 'from', value: Address.default() },
      { key: 'signature', value: Bytes.default() }
    ])
  }

  public static fromStruct(struct: Struct): Transaction {
    const depositContractAddress = struct.data[0].value as Address
    const range = struct.data[1].value as Struct
    const prevBlockNumber = struct.data[2].value as BigNumber
    const stateObject = struct.data[3].value as Struct
    const from = struct.data[4].value as Address
    const signature = struct.data[5].value as Bytes

    return new Transaction(
      depositContractAddress as Address,
      Range.fromStruct(range as Struct),
      prevBlockNumber,
      Property.fromStruct(stateObject as Struct),
      from as Address,
      signature as Bytes
    )
  }

  public toStruct(): Struct {
    return new Struct([
      { key: 'depositContractAddress', value: this.depositContractAddress },
      { key: 'range', value: this.range.toStruct() },
      { key: 'prevBlockNumber', value: this.prevBlockNumber },
      { key: 'stateObject', value: this.stateObject.toStruct() },
      { key: 'from', value: this.from },
      { key: 'signature', value: this.signature }
    ])
  }

  public get body(): Struct {
    return new Struct([
      { key: 'depositContractAddress', value: this.depositContractAddress },
      { key: 'range', value: this.range.toStruct() },
      { key: 'prevBlockNumber', value: this.prevBlockNumber },
      { key: 'stateObject', value: this.stateObject.toStruct() },
      { key: 'from', value: this.from }
    ])
  }

  public getHash(): Bytes {
    return Keccak256.hash(EthCoder.encode(this.body))
  }

  public toProperty(deciderAddress: Address): Property {
    return new Property(deciderAddress, [
      Bytes.fromHexString(this.depositContractAddress.raw).padZero(32),
      this.range.toBytes(),
      Bytes.fromHexString(this.prevBlockNumber.toHexString()).padZero(32),
      EthCoder.encode(this.stateObject.toStruct())
    ])
  }
}

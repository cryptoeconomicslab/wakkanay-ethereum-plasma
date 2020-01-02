import {
  Struct,
  BigNumber,
  Address,
  Range,
  Bytes,
  Integer
} from 'wakkanay/dist/types'

export const STATUS = {
  TRUE: Integer.from(1),
  FALSE: Integer.from(0)
}

export type valueof<T> = T[keyof T]

export default class TransactionReceipt {
  constructor(
    readonly status: typeof STATUS[keyof typeof STATUS],
    readonly blockNumber: BigNumber,
    readonly range: Range,
    readonly depositContractAddress: Address,
    readonly from: Address,
    readonly transactionHash: Bytes
  ) {}

  public static default(): TransactionReceipt {
    return new TransactionReceipt(
      STATUS.TRUE,
      BigNumber.default(),
      new Range(BigNumber.default(), BigNumber.default()),
      Address.default(),
      Address.default(),
      Bytes.default()
    )
  }

  public static getParamType(): Struct {
    return new Struct({
      status: Integer.default(),
      blockNumber: BigNumber.default(),
      range: new Range(BigNumber.default(), BigNumber.default()).toStruct(),
      depositContractAddress: Address.default(),
      from: Address.default(),
      transactionHash: Bytes.default()
    })
  }

  public static fromStruct(struct: Struct): TransactionReceipt {
    const {
      status,
      blockNumber,
      range,
      depositContractAddress,
      from,
      transactionHash
    } = struct.data

    return new TransactionReceipt(
      status as Integer,
      blockNumber as BigNumber,
      Range.fromStruct(range as Struct),
      depositContractAddress as Address,
      from as Address,
      transactionHash as Bytes
    )
  }

  public toStruct(): Struct {
    return new Struct({
      status: this.status,
      range: this.range.toStruct(),
      blockNumber: this.blockNumber,
      depositContractAddress: this.depositContractAddress,
      from: this.from,
      transactionHash: this.transactionHash
    })
  }
}

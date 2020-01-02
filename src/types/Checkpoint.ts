import { Address, BigNumber, Range, Struct, Bytes } from 'wakkanay/dist/types'
import { Property } from 'wakkanay/dist/ovm'

export default class Checkpoint {
  constructor(public subrange: Range, public stateUpdate: Property) {}

  public static default(): Checkpoint {
    return new Checkpoint(
      new Range(BigNumber.default(), BigNumber.default()),
      new Property(Address.default(), [])
    )
  }

  public static getParamType(): Struct {
    return new Struct({
      subrange: Range.getParamType(),
      stateUpdate: Property.getParamType()
    })
  }

  public static fromStruct(struct: Struct): Checkpoint {
    const { subrange, stateUpdate } = struct.data

    return new Checkpoint(
      Range.fromStruct(subrange as Struct),
      Property.fromStruct(stateUpdate as Struct)
    )
  }

  public toStruct(): Struct {
    return new Struct({
      subrange: this.subrange.toStruct(),
      stateUpdate: this.stateUpdate.toStruct()
    })
  }

  // TODO: implement calculate checkpoint id
  public getId(): Bytes {
    return Bytes.default()
  }
}

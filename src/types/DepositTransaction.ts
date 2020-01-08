import { types, ovm } from 'wakkanay-ethereum'
import Address = types.Address
import Property = ovm.Property

export default class DepositTransaction {
  constructor(
    readonly depositContractAddress: Address,
    readonly stateUpdate: Property
  ) {}

  public toString(): string {
    return `DepostiTransaction {
      contractAddress: ${this.depositContractAddress.data},
      stateUpdate: ${this.stateUpdate.toStruct().toString()}
    }`
  }
}

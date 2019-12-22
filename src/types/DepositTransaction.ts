import { Address } from 'wakkanay/dist/types'
import { Property } from 'wakkanay/dist/ovm'

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

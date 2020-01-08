import { types, ovm } from 'wakkanay-ethereum'
import Address = types.Address
import Range = types.Range
import BigNumber = types.BigNumber
import Bytes = types.Bytes
import Property = ovm.Property

import Block from '../../src/types/Block'
import Coder from '../../src/Coder'
import StateUpdate from '../../src/types/StateUpdate'

describe('Block', () => {
  const testAddr = Address.default()
  test('encode, decode', () => {
    const stateUpdateProperty = new Property(
      Address.default(),
      [
        Address.default(),
        new Range(BigNumber.from(0), BigNumber.from(10)).toStruct(),
        BigNumber.from(1),
        new Property(Address.default(), [
          Bytes.fromHexString('0x01')
        ]).toStruct()
      ].map(Coder.encode)
    )

    const map = new Map()
    map.set(testAddr.data, [
      new StateUpdate(stateUpdateProperty),
      new StateUpdate(stateUpdateProperty)
    ])
    map.set('0x0001100110011001100110011001101100110011', [
      new StateUpdate(stateUpdateProperty)
    ])
    const block = new Block(BigNumber.from(5), map)
    const encoded = Coder.encode(block.toStruct())
    const decoded = Block.fromStruct(
      Coder.decode(Block.getParamType(), encoded)
    )

    expect(decoded).toStrictEqual(block)
  })
})

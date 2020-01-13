import { types, ovm } from 'wakkanay-ethereum'
import Address = types.Address
import Range = types.Range
import BigNumber = types.BigNumber
import Bytes = types.Bytes
import Property = ovm.Property
import { StateUpdate, StateUpdateRecord } from '../../src/types'
import Coder from '../../src/Coder'

describe('StateUpdate', () => {
  const stateUpdateProperty = new Property(
    Address.default(),
    [
      Address.default(),
      new Range(BigNumber.from(0), BigNumber.from(10)).toStruct(),
      BigNumber.from(1),
      new Property(Address.default(), [Bytes.fromHexString('0x01')]).toStruct()
    ].map(Coder.encode)
  )

  test('new(property)', () => {
    const stateUpdate = new StateUpdate(stateUpdateProperty)
    expect(stateUpdate.property).toStrictEqual(stateUpdateProperty)
    expect(stateUpdate.depositContractAddress).toStrictEqual(Address.default())
    expect(stateUpdate.range).toStrictEqual(
      new Range(BigNumber.from(0), BigNumber.from(10))
    )
    expect(stateUpdate.blockNumber).toStrictEqual(BigNumber.from(1))
    expect(stateUpdate.stateObject).toStrictEqual(
      new Property(Address.default(), [Bytes.fromHexString('0x01')])
    )
  })

  test('toRecord()', () => {
    const stateUpdate = new StateUpdate(stateUpdateProperty)
    const record = stateUpdate.toRecord()
    expect(record).toStrictEqual(
      new StateUpdateRecord(
        Address.default(),
        Address.default(),
        BigNumber.from(1),
        new Property(Address.default(), [Bytes.fromHexString('0x01')])
      )
    )
  })

  test('fromRangeRecord()', () => {
    const record = new StateUpdateRecord(
      Address.default(),
      Address.default(),
      BigNumber.from(1),
      new Property(Address.default(), [Bytes.fromHexString('0x01')])
    )
    const range = new Range(BigNumber.from(0), BigNumber.from(10))

    expect(StateUpdate.fromRecord(record, range)).toStrictEqual(
      new StateUpdate(stateUpdateProperty)
    )
  })

  test('range', () => {
    const stateUpdate = new StateUpdate(stateUpdateProperty)
    expect(stateUpdate.range).toStrictEqual(
      new Range(BigNumber.from(0), BigNumber.from(10))
    )
  })

  test('update()', () => {
    const stateUpdate = new StateUpdate(stateUpdateProperty)
    stateUpdate.update({
      range: new Range(BigNumber.from(5), BigNumber.from(10))
    })
    expect(stateUpdate.range).toStrictEqual(
      new Range(BigNumber.from(5), BigNumber.from(10))
    )
  })
})

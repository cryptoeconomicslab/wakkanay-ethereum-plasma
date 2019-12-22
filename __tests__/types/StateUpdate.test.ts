import { Property, FreeVariable } from 'wakkanay/dist/ovm'
import { StateUpdate, StateUpdateRecord } from '../../src/types'
import { Address, Range, BigNumber, Bytes } from 'wakkanay/dist/types'
import Coder from '../../src/Coder'
import { config } from 'dotenv'
config()

const THERE_EXISTS_ADDRESS = Address.from(
  process.env.THERE_EXISTS_ADDRESS as string
)
const IS_VALID_SIGNATURE_ADDRESS = Address.from(
  process.env.IS_VALID_SIG_ADDRESS as string
)

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

  // TODO: extract and use compiled property
  function ownershipProperty(from: Address) {
    const hint = Bytes.fromString('tx,key')
    const sigHint = Bytes.fromString('sig,key')
    return new Property(THERE_EXISTS_ADDRESS, [
      hint,
      Bytes.fromString('tx'),
      Coder.encode(
        new Property(THERE_EXISTS_ADDRESS, [
          sigHint,
          Bytes.fromString('sig'),
          Coder.encode(
            new Property(IS_VALID_SIGNATURE_ADDRESS, [
              FreeVariable.from('tx'),
              FreeVariable.from('sig'),
              Coder.encode(from),
              Bytes.fromString('secp256k1')
            ]).toStruct()
          )
        ]).toStruct()
      )
    ])
  }

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

  test('isOwnershipState() true', () => {
    const property = ownershipProperty(Address.default())
    const stateUpdate = new StateUpdate(
      new Property(
        Address.default(),
        [
          Address.default(),
          new Range(BigNumber.from(0), BigNumber.from(10)).toStruct(),
          BigNumber.from(1),
          property.toStruct()
        ].map(Coder.encode)
      )
    )
    expect(stateUpdate.isOwnershipState()).toBeTruthy()
  })

  test('isOwnershipState() false', () => {
    const stateUpdate = new StateUpdate(stateUpdateProperty)
    expect(stateUpdate.isOwnershipState()).toBeFalsy()
  })

  test('getOwner()', () => {
    const property = ownershipProperty(Address.default())
    const stateUpdate = new StateUpdate(
      new Property(
        Address.default(),
        [
          Address.default(),
          new Range(BigNumber.from(0), BigNumber.from(10)).toStruct(),
          BigNumber.from(1),
          property.toStruct()
        ].map(Coder.encode)
      )
    )
    expect(stateUpdate.getOwner()).toStrictEqual(Address.default())
  })

  test('getOwner() undefined', () => {
    const stateUpdate = new StateUpdate(stateUpdateProperty)
    expect(stateUpdate.getOwner()).toBeFalsy()
  })
})

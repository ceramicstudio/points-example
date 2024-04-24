import { PointsWriter, PointsReader } from '@ceramic-solutions/points'
import { getAuthenticatedDID } from '@ceramic-solutions/key-did'
import { fromString } from 'uint8arrays'

const CERAMIC_PRIVATE_KEY: string = process.env.CERAMIC_PRIVATE_KEY ?? ''
const aggregationModelID: string | undefined = process.env.AGGREGATION_ID ?? undefined

//eslint-disable-next-line
const seed = fromString(CERAMIC_PRIVATE_KEY, 'base16') as Uint8Array

// create a context writer
const contextWriter = await PointsWriter.fromSeed({
  aggregationModelID,
  seed,
})

// create a total writer
const writer = await PointsWriter.fromSeed({
  seed,
})

// generate issuer for reader context
const issuer = await getAuthenticatedDID(seed)

//create a context reader
const contextReader = PointsReader.create({
  issuer: issuer.id,
  aggregationModelID,
})

//create a total reader
const reader = PointsReader.create({
  issuer: issuer.id,
})

export { contextWriter, writer, contextReader, reader }

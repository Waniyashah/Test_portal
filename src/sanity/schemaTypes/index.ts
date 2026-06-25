import { type SchemaTypeDefinition } from 'sanity'
import { userType } from './user'
import { testType } from './test'
import { questionType } from './question'
import { resultType } from './result'
import { subscriptionType } from './subscription'

export const schemaTypes: { types: SchemaTypeDefinition[] } = {
    types: [userType, testType, questionType, resultType, subscriptionType],
}

import 'reflect-metadata'
import { isArray, isNil } from 'lodash'
import { Class } from '../types/Class'
import { getToDb, hasToDb } from './decorators/toDb.decorator'
import { isTransient } from './decorators/transient.decorator'
import { getField, isField } from './decorators/field.decorator'
import { getToModel, hasToModel } from './decorators/toModel.decorator'
import { toJS } from 'mobx'
import { getTransform, hasTransform } from './decorators/transform.decorator'
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from '@firebase/firestore-types'
import firebase from 'firebase/app'

export class Transformer {
  static firestoreConverter<T>(clazz: Class<T>): FirestoreDataConverter<T> {
    return {
      toFirestore(modelObject: T): DocumentData {
        return Transformer.modelToDb(modelObject)
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): T {
        return Transformer.dbToModel(snapshot, clazz)
      },
    }
  }

  static modelToDb<T>(instance: T): DocumentData {
    Transformer.validateDecorators(instance)

    if (isNil(instance)) {
      return null
    }

    if (hasToDb(instance)) {
      const toDb = getToDb(instance)
      return toDb(instance)
    }

    const transformed = {}

    Object.keys(instance).forEach((key) => {
      try {
        if (
          (instance[key] !== undefined && isField(instance, key)) ||
          (hasTransform(instance, key) && !isNil(instance[key]))
        ) {
          const hasType = !!getField(instance, key).type
          const fieldTransformer =
            hasTransform(instance, key) && getTransform(instance, key)?.toDb

          transformed[key] = !!fieldTransformer
            ? fieldTransformer(instance[key])
            : isArray(instance[key])
            ? Array.from(instance[key]).map((arrayValue) =>
                Transformer.toDbValue(arrayValue, hasType),
              )
            : Transformer.toDbValue(instance[key], hasType)
        }
      } catch (e) {
        console.error(
          `Error when transforming field ${key} in ${instance.constructor.name}`,
        )
        throw e
      }
    })
    return transformed
  }

  static dbToModel<T>(
    data: { [key: string]: any } | QueryDocumentSnapshot,
    Clazz: Class<T>,
  ): T {
    let dbObject
    if (!!data.data && typeof data.data === 'function') {
      dbObject = data.data()
      if (!!data.id) {
        dbObject.id = data.id
      }
    } else {
      dbObject = data
    }

    if (hasToModel(Clazz)) {
      const toClassInstance = getToModel(Clazz)
      return toClassInstance(dbObject)
    }

    const transformed = new Clazz()

    Object.keys(toJS(transformed)).forEach((key) => {
      if (isField(transformed, key) && !isNil(dbObject[key])) {
        const fieldType = getField(transformed, key).type
        const fieldTransformer = getTransform(transformed, key)?.toApp

        transformed[key] = !!fieldTransformer
          ? fieldTransformer(dbObject[key])
          : isArray(dbObject[key])
          ? Array.from(dbObject[key]).map((arrayValue) =>
              this.toModelValue(arrayValue, fieldType),
            )
          : this.toModelValue(dbObject[key], fieldType)
      }
    })
    return transformed
  }

  private static toDbValue(fieldValue: any, isRelated: boolean) {
    if (!isNil(fieldValue) && fieldValue instanceof Date) {
      return firebase.firestore.Timestamp.fromDate(fieldValue)
    }

    if (isRelated) {
      return Transformer.modelToDb(fieldValue)
    }
    if (!isNil(fieldValue) && typeof fieldValue === 'object') {
      const returnValue = {}
      Object.keys(fieldValue)
        .filter((key) => fieldValue[key] !== undefined)
        .forEach((key) => (returnValue[key] = fieldValue[key]))
      return returnValue
    }

    return fieldValue
  }

  private static toModelValue(fieldValue: any, type: Class) {
    if (!!type) {
      return type === Date && !!fieldValue.seconds
        ? new firebase.firestore.Timestamp(
            fieldValue.seconds,
            fieldValue.nanoseconds,
          ).toDate()
        : Transformer.dbToModel(fieldValue, type)
    }
    return fieldValue
  }

  private static validateDecorators(transformable: any) {
    if (
      !transformable ||
      (hasToDb(transformable) && hasToModel(transformable.constructor))
    ) {
      return
    }
    Object.keys(toJS(transformable)).forEach((key) => {
      if (!isTransient(transformable, key) && !isField(transformable, key)) {
        throw new Error(
          `Field ${key} in ${transformable.constructor.name} is missing required annotation  field() or transient()`,
        )
      }
    })
  }
}

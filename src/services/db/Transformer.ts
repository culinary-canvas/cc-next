import 'reflect-metadata'
import { isArray, isNil } from 'lodash'
import { Class } from '../../types/Class'
import {
  getTransformToDb,
  hasTransformToDb,
} from './decorators/transformToDb.decorator'
import { isTransient } from './decorators/transient.decorator'
import { getField, isField } from './decorators/field.decorator'
import { Model } from './Model'
import {
  getTransformToApp,
  hasTransformToApp,
} from './decorators/transformToApp.decorator'
import { toJS } from 'mobx'
import { getTransform, hasTransform } from './decorators/transform.decorator'
import firebase from 'firebase'

export class Transformer {
  static toJson(doc: firebase.firestore.QueryDocumentSnapshot) {
    return JSON.parse(JSON.stringify({ id: doc.id, ...doc.data() }))
  }

  static listToJson(docs: firebase.firestore.QueryDocumentSnapshot[]) {
    return docs.map((doc) => this.toJson(doc))
  }

  static toDb(transformable: any): any {
    Transformer.validateDecorators(transformable)

    if (isNil(transformable)) {
      return null
    }

    if (hasTransformToDb(transformable)) {
      const toDb = getTransformToDb(transformable)
      return toDb(transformable)
    }

    const transformed = {}

    Object.keys(transformable).forEach((key) => {
      try {
        if (
          (transformable[key] !== undefined && isField(transformable, key)) ||
          (hasTransform(transformable, key) && !isNil(transformable[key]))
        ) {
          const hasType = !!getField(transformable, key).type
          const toDb =
            hasTransform(transformable, key) &&
            getTransform(transformable, key)?.toDb

          transformed[key] = !!toDb
            ? toDb(transformable[key])
            : isArray(transformable[key])
            ? Array.from(transformable[key]).map((arrayValue) =>
                Transformer.transformValueToDb(arrayValue, hasType),
              )
            : Transformer.transformValueToDb(transformable[key], hasType)
        }
      } catch (e) {
        console.error(
          `Error when transforming field ${key} in ${transformable.constructor.name}`,
        )
        throw e
      }
    })

    return transformed
  }

  static allToApp<T>(documentData: { [key: string]: any }[], Clazz: Class<T>) {
    return documentData.map((d) => this.toApp(d, Clazz))
  }

  static toApp<T>(
    documentData: { [key: string]: any },
    Clazz: Class<T>,
    id?: string,
  ) {
    if (hasTransformToApp(Clazz)) {
      const toApp = getTransformToApp(Clazz)
      return toApp(documentData)
    }

    const transformed = new Clazz()

    if (!!id) {
      ;((transformed as unknown) as Model).id = id
    }

    Object.keys(toJS(transformed)).forEach((key) => {
      if (isField(transformed, key) && !isNil(documentData[key])) {
        const fieldType = getField(transformed, key).type
        const toApp = getTransform(transformed, key)?.toApp

        transformed[key] = !!toApp
          ? toApp(documentData[key])
          : isArray(documentData[key])
          ? Array.from(documentData[key]).map((arrayValue) =>
              Transformer.transformValueToApp(arrayValue, fieldType),
            )
          : Transformer.transformValueToApp(documentData[key], fieldType)
      }
    })
    return transformed
  }

  private static transformValueToDb<T>(fieldValue: any, isRelated: boolean) {
    if (isRelated) {
      return Transformer.toDb(fieldValue)
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

  private static transformValueToApp<T>(fieldValue: any, type: Class<T>) {
    return !!type ? Transformer.toApp(fieldValue, type) : fieldValue
  }

  private static validateDecorators(transformable: any) {
    if (
      hasTransformToDb(transformable) &&
      hasTransformToApp(transformable.constructor)
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

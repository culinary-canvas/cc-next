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
import { getTransform } from './decorators/transform.decorator'
import firebase from 'firebase'

export class DbTransformService {
  static transformToDb(transformable: any): any {
    DbTransformService.validateDecorators(transformable)

    if (isNil(transformable)) {
      return null
    }

    if (hasTransformToDb(transformable)) {
      const toDb = getTransformToDb(transformable)
      return toDb(transformable)
    }

    const transformed = {}

    Object.keys(transformable).forEach((key) => {
      if (
        transformable[key] !== undefined &&
        isField(transformable, key) &&
        !isNil(transformable[key])
      ) {
        const type = Reflect.getMetadata('design:type', transformable, key)
        const hasType = !!getField(transformable, key).type
        const toDb = getTransform(transformed, key)?.toDb

        transformed[key] = !!toDb
          ? toDb(transformable[key])
          : type === Array
          ? Array.from(transformable[key]).map((arrayValue) =>
              DbTransformService.transformValueToDb(arrayValue, hasType),
            )
          : DbTransformService.transformValueToDb(transformable[key], hasType)
      }
    })

    return transformed
  }

  static transformToApp<T>(
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
              DbTransformService.transformValueToApp(arrayValue, fieldType),
            )
          : DbTransformService.transformValueToApp(documentData[key], fieldType)
      }
    })
    return transformed
  }

  private static transformValueToDb<T>(fieldValue: any, isRelated: boolean) {
    if (isRelated) {
      return DbTransformService.transformToDb(fieldValue)
    }

    if (typeof fieldValue === 'object') {
      const returnValue = {}
      Object.keys(fieldValue)
        .filter((key) => fieldValue[key] !== undefined)
        .forEach((key) => (returnValue[key] = fieldValue[key]))
      return returnValue
    }

    return fieldValue
  }

  private static transformValueToApp<T>(fieldValue: any, type: Class<T>) {
    return !!type
      ? DbTransformService.transformToApp(fieldValue, type)
      : fieldValue
  }

  private static validateDecorators(transformable: any) {
    if (
      hasTransformToDb(transformable) &&
      hasTransformToApp(transformable.constructor)
    ) {
      return
    }

    Object.keys(transformable).forEach((key) => {
      if (!isTransient(transformable, key) && !isField(transformable, key)) {
        throw new Error(
          `Field ${key} in ${transformable.constructor.name} is missing required annotation  field() or transient()`,
        )
      }
    })
  }

  static toJson(querySnapshot: firebase.firestore.QuerySnapshot) {
    return querySnapshot.docs.map((doc) =>
      JSON.parse(JSON.stringify({ id: doc.id, ...doc.data() })),
    )
  }
}

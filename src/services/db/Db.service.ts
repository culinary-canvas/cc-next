import * as firebase from 'firebase/app'
import 'firebase/firestore'

import DateTime from '../../domain/DateTime/DateTime'
import SimpleDate from '../../domain/DateTime/SimpleDate'
import Time from '../../domain/DateTime/Time'
import { Model } from './Model'
import { OrderBy } from './OrderBy'
import { SubscriptionHandler } from './SubscriptionHandler'
import Where from './Where'
import { Class } from '../../types/Class'
import { DbTransformService } from './DbTransform.service'
import { getCollection } from './decorators/collection.decorator'
import { User } from 'firebase'
import { initFirebase } from '../firebase/Firebase.service'
import { QuerySnapshot } from '@firebase/firestore-types'

class DbService<T extends Model> {
  /**
   * Name of collection to store/fetch clazz instances in/from
   * Set with Db.model(collectionName) on clazz
   * @private
   */
  private readonly collection: string

  constructor(private readonly Clazz: Class<T>) {
    initFirebase()
    const dummy = new Clazz()
    const name = getCollection(dummy)?.name
    if (!name) {
      throw new Error(
        `Required metadata "collectionName" is missing in ${this.Clazz.name}`,
      )
    }
    this.collection = name
  }

  /**
   * Check if any model exists for where clause
   *
   * @param conditions
   */
  async exists(conditions: Where[]): Promise<boolean> {
    const collectionRef = firebase.firestore().collection(this.collection)
    const query = this.buildQuery(collectionRef, conditions, [], 2)
    const result = await query.get()
    return !result.empty
  }

  /**
   * Subscribe to models
   *
   * @param conditions
   * @param onAdded
   * @param onModified
   * @param onRemoved
   */
  subscribe(
    conditions: Where | Where[],
    onAdded: (model: T) => void,
    onModified?: (model: T) => void,
    onRemoved?: (id: string) => void,
  ): SubscriptionHandler {
    const collectionRef = firebase.firestore().collection(this.collection)
    const query = this.buildQuery(
      collectionRef,
      !!conditions
        ? Array.isArray(conditions)
          ? conditions
          : [conditions]
        : undefined,
    )
    const subscriptionHandler = new SubscriptionHandler()
    subscriptionHandler.firestoreUnsubscribe = query.onSnapshot(
      (querySnapshot) =>
        this.onSnapshotChange(
          subscriptionHandler,
          querySnapshot,
          (r) => onAdded(r),
          (r) => onModified(r),
          (id) => onRemoved(id),
        ),
      (e) => {
        throw e
      },
    )
    return subscriptionHandler
  }

  /**
   * Get models from DB
   *
   * @param conditions
   * @param orderBy
   * @param limit
   * @param startAfter
   */
  async get<U extends T[] | QuerySnapshot = T[]>(options: {
    conditions?: Where | Where[]
    orderBy?: OrderBy[]
    limit?: number
    startAfter?: number
    transform?: boolean
  }): Promise<U> {
    const { conditions, orderBy, limit, startAfter, transform = true } = options

    try {
      const collectionRef = firebase.firestore().collection(this.collection)
      const query = this.buildQuery(
        collectionRef,
        !!conditions
          ? Array.isArray(conditions)
            ? conditions
            : [conditions]
          : undefined,
        orderBy,
        limit,
        startAfter,
      )

      const result: QuerySnapshot = await query.get()
      return (transform ? this.transform(result) : result) as U
    } catch (e) {
      console.warn('Error when executing query ', {
        collection: this.collection,
        conditions,
        orderBy,
        limit,
        startAfter,
      })
      throw e
    }
  }

  /**
   * Convenience method to get model from DB by ID
   *
   * @param id
   */
  async getById(id: string): Promise<T> {
    const doc: firebase.firestore.DocumentSnapshot = await firebase
      .firestore()
      .collection(this.collection)
      .doc(id)
      .get()

    if (doc.exists) {
      return this.transformToApp(doc)
    }
  }

  /**
   * Store model in DB
   *
   * @param model
   * @param user
   */
  async save(model: T, user: User): Promise<T> {
    this.beforeSave(model, user)
    const lastPersistedState = model.id ? await this.getById(model.id) : null

    const dbObject = DbTransformService.transformToDb(model)
    const collectionRef = firebase.firestore().collection(this.collection)
    const doc = model.id ? collectionRef.doc(model.id) : collectionRef.doc()
    await doc.set(dbObject)

    const persisted = await this.getById(doc.id)

    await this.afterSave(lastPersistedState, persisted)
    return persisted
  }

  /**
   * Delete model from DB
   *
   * @param id
   */
  async delete(id: string): Promise<void> {
    const collectionRef = firebase.firestore().collection(this.collection)
    const doc = collectionRef.doc(id)
    await doc.delete()
  }

  /**
   * Store multiple models in DB
   * TODO: AddSection all overhead like after save and such
   *
   * @param models
   */
  async saveBatch(models: T[] | { id: string }[]): Promise<void> {
    const batch = firebase.firestore().batch()
    const collectionRef = firebase.firestore().collection(this.collection)

    models.forEach((model) => {
      const doc = model.id ? collectionRef.doc(model.id) : collectionRef.doc()
      const dbObject = DbTransformService.transformToDb(model)
      batch.set(doc, dbObject)
    })

    await batch.commit()
  }

  private beforeSave(model: T, user: User) {
    if (!model.id) {
      model.created = DateTime.create()
      model.createdById = user.uid
    }
    model.modified = DateTime.create()
    console.debug('Before save: ', model)
  }

  private async afterSave(lastPersistedState: T, persisted: T) {}

  private transform(result: firebase.firestore.QuerySnapshot) {
    return !result.empty
      ? result.docs.map((doc) =>
          DbTransformService.transformToApp(
            doc.data() as {},
            this.Clazz,
            doc.id,
          ),
        )
      : []
  }

  private onSnapshotChange(
    subscriptionHandler: SubscriptionHandler,
    querySnapshot: firebase.firestore.QuerySnapshot,
    onAdded: (model: T) => void,
    onModified?: (model: T) => void,
    onRemoved?: (id: string) => void,
  ) {
    querySnapshot
      .docChanges()
      .forEach(async (change: firebase.firestore.DocumentChange) => {
        if (change.type === 'added' || change.type === 'modified') {
          const model = DbTransformService.transformToApp(
            change.doc.data() as {},
            this.Clazz,
            change.doc.id,
          )

          if (change.type === 'added') {
            onAdded(model)
          } else {
            onModified(model)
          }
        }

        if (change.type === 'removed' && onRemoved) {
          const id = change.doc.id
          onRemoved(id)
        }
      })
  }

  private transformToApp(doc: firebase.firestore.DocumentSnapshot): T {
    return DbTransformService.transformToApp(doc.data(), this.Clazz, doc.id)
  }

  private buildQuery(
    collectionRef: firebase.firestore.CollectionReference,
    conditions: Where[] = [],
    orderBy: OrderBy[] = [],
    limit?: number,
    startAfter?: number,
  ): firebase.firestore.Query {
    let query: firebase.firestore.Query = collectionRef

    conditions.forEach((condition) => {
      let value = condition.value

      if (value === undefined) {
        console.warn(
          `Condition value is undefined for ${this.collection}`,
          condition,
        )
      } else if (this.isDate(value)) {
        value = value.toDate()
      }

      query = query.where(String(condition.key), condition.operator, value)
    })

    orderBy.forEach((o) => {
      query = query.orderBy(o.fieldPath, o.directionStr)
    })

    if (limit) {
      query = query.limit(limit)
    }

    if (startAfter) {
      query = query.startAfter(startAfter)
    }

    return query
  }

  private isDate(value: any) {
    return (
      value instanceof SimpleDate ||
      value instanceof Time ||
      value instanceof DateTime
    )
  }
}

export default DbService

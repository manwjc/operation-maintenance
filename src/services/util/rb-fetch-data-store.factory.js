import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/defer'
import 'rxjs/add/observable/merge'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/publishReplay'

const INIT_VALUE_TOKEN = '__INIT_VALUE_TOKEN__'
const FETCH_START_TOKEN = '__FETCH_START_TOKEN__'
const SPECIAL_TOKENS = [INIT_VALUE_TOKEN, FETCH_START_TOKEN]
/**
 * Simple data store based on fetch request.
 */
class FetchDataStore {
  constructor (request) {
    this._fetchSubject$ = new BehaviorSubject(INIT_VALUE_TOKEN)
    this._request = request

    // In case the refetch function is invoked too many times in a queue
    this._refetch = () => {
      this._fetchSubject$.next(FETCH_START_TOKEN)
      return this._request().then(data => {
        // 请求成功后缓存数据
        this._cached = data
        this._fetchSubject$.next(data)
        return data
      }).catch(error => {
        const wrappedError = new Error(error)
        this._fetchSubject$.next(wrappedError)
        return wrappedError
      })
    }

    // 合并请求产生的可观察对象和_fetchSubject$ distinctUntilChanged不发送重复值
    this._data$ = Observable.merge(
      Observable.defer(() => this.refetch()),
      this._fetchSubject$
    )
    .map(data => ((data instanceof Error) || SPECIAL_TOKENS.includes(data)) ? null : data)
    .map(data => (data || this._cached)).distinctUntilChanged().publishReplay(1).refCount()
  }

  /**
   * Fetch data stream.
   */
  get data$ () {
    return this._data$
  }

  /**
   * Empty states.
   */
  get empty$ () {
    return this._fetchSubject$.asObservable()
    .map(() => !this.snapshot || this.snapshot.length === 0)
    .publishReplay(1).refCount()
  }

  /**
   * Errors for each fetch. Will emit null when no error.
   */
  get error$ () {
    return this._fetchSubject$.asObservable()
    .map(data => data instanceof Error ? data : null)
    .publishReplay(1).refCount()
  }

  /**
   * Loading state for the store.
   */
  get loading$ () {
    return this._fetchSubject$.asObservable()
    .map(data => data === FETCH_START_TOKEN && !this.snapshot)
    .publishReplay(1).refCount()
  }

  get snapshot () {
    return this._cached
  }

  refetch () {
    return this._refetch()
  }
}

export default FetchDataStore

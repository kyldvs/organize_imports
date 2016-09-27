/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @providesModule FluxStore
 * @flow
 */

'use strict';

export type FluxDispatchToken = DispatchToken;

/**
 * This class represents the most basic functionality for a FluxStore. Do not
 * extend this store directly; instead extend FluxReduceStore when creating a
 * new store.
 */
class FluxStore {

  // private
  _dispatchToken: FluxDispatchToken;

  // protected, available to subclasses
  __changed: bool;
  __changeEvent: string;
  __className: any;
  __dispatcher: Dispatcher<any>;
  __emitter: EventEmitter;

  constructor(dispatcher: Dispatcher<any>): void {
    this.__className = this.constructor.name;

    this.__changed = false;
    this.__changeEvent = 'change';
    this.__dispatcher = dispatcher;
    this.__emitter = new EventEmitter();
    this._dispatchToken = dispatcher.register(payload => {
      this.__invokeOnDispatch(payload);
    }, this.__getIDForDispatcher());
  }

  addListener(callback: (eventType?: string) => void): { remove: () => void } {
    return this.__emitter.addListener(this.__changeEvent, callback);
  }

  getDispatcher(): Dispatcher<any> {
    return this.__dispatcher;
  }

  /**
   * This exposes a unique string to identify each store's registered callback.
   * This is used with the dispatcher's waitFor method to devlaratively depend
   * on other stores updating themselves first.
   */
  getDispatchToken(): string {
    return this._dispatchToken;
  }

  /**
   * Returns whether the store has changed during the most recent dispatch.
   */
  hasChanged(): bool {
    invariant(this.__dispatcher.isDispatching(), '%s.hasChanged(): Must be invoked while dispatching.', this.__className);
    return this.__changed;
  }

  __emitChange(): void {
    invariant(this.__dispatcher.isDispatching(), '%s.__emitChange(): Must be invoked while dispatching.', this.__className);
    this.__changed = true;
  }

  /**
   * This method encapsulates all logic for invoking __onDispatch. It should
   * be used for things like catching changes and emitting them after the
   * subclass has handled a payload.
   */
  __invokeOnDispatch(payload: Object): void {
    this.__changed = false;
    this.__onDispatch(payload);
    if (this.__changed) {
      this.__emitter.emit(this.__changeEvent);
    }
  }

  /**
   * The callback that will be registered with the dispatcher during
   * instantiation. Subclasses must override this method. This callback is the
   * only way the store receives new data.
   */
  __onDispatch(payload: Object): void {
    invariant(false, '%s has not overridden FluxStore.__onDispatch(), which is required', this.__className);
  }

  /**
   * This generates an ID to be used in the Dispatcher, which can be useful
   * for logging. It can be overridden in subclasses for custom ID schemes.
   */
  __getIDForDispatcher(): any {
    return (this: any).__className;
  }
}

module.exports = FluxStore;

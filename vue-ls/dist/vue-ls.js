/* eslint class-methods-use-this: off */
let ls = {};
class MemoryStorageInterface {
    constructor() {
        Object.defineProperty(this, 'length', {
            /**
             * Define length property
             *
             * @return {number}
             */
            get() {
                return Object.keys(ls).length;
            },
        });
    }
    /**
     * Get item
     *
     * @param {string} name
     * @returns {*}
     */
    getItem(name) {
        return name in ls ? ls[name] : null;
    }
    /**
     * Set item
     *
     * @param {string} name
     * @param {*} value
     * @returns {boolean}
     */
    setItem(name, value) {
        ls[name] = value;
        return true;
    }
    /**
     * Remove item
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeItem(name) {
        const found = name in ls;
        if (found) {
            return delete ls[name];
        }
        return false;
    }
    /**
     * Clear storage
     *
     * @returns {boolean}
     */
    clear() {
        ls = {};
        return true;
    }
    /**
     * Get item by key
     *
     * @param {number} index
     * @returns {*}
     */
    key(index) {
        const keys = Object.keys(ls);
        return typeof keys[index] !== 'undefined' ? keys[index] : null;
    }
}
const MemoryStorage = new MemoryStorageInterface();

const listeners = {};
/**
 * Event class
 */
class WebStorageEvent {
    /**
     * Add storage change event
     *
     * @param {string} name
     * @param {Function} callback
     */
    static on(name, callback) {
        if (typeof listeners[name] === 'undefined') {
            listeners[name] = [];
        }
        listeners[name].push(callback);
    }
    /**
     * Remove storage change event
     *
     * @param {string} name
     * @param {Function} callback
     */
    static off(name, callback) {
        if (listeners[name].length) {
            listeners[name].splice(listeners[name].indexOf(callback), 1);
        }
        else {
            listeners[name] = [];
        }
    }
    /**
     * Emit event
     *
     * @param {Object} event
     */
    static emit(event) {
        const e = event || window.event;
        const getValue = (data) => {
            try {
                return JSON.parse(data).value;
            }
            catch (err) {
                return data;
            }
        };
        const fire = (listener) => {
            const newValue = getValue(e.newValue);
            const oldValue = getValue(e.oldValue);
            listener(newValue, oldValue, e.url || e.uri);
        };
        if (typeof e === 'undefined' || typeof e.key === 'undefined') {
            return;
        }
        const all = listeners[e.key];
        if (typeof all !== 'undefined') {
            all.forEach(fire);
        }
    }
}

/**
 * Storage Bridge
 */
class WebStorage {
    /**
     * @param {Object} storage
     */
    constructor(storage) {
        this.storage = storage;
        this.options = {
            namespace: '',
            events: ['storage'],
        };
        Object.defineProperty(this, 'length', {
            /**
             * Define length property
             *
             * @return {number}
             */
            get() {
                return this.storage.length;
            },
        });
        if (typeof window !== 'undefined') {
            for (const i in this.options.events) {
                if (window.addEventListener) {
                    window.addEventListener(this.options.events[i], WebStorageEvent.emit, false);
                }
                else {
                    window[`on${this.options.events[i]}`] = WebStorageEvent.emit;
                }
            }
        }
    }
    /**
     * Set Options
     *
     * @param {Object} options
     */
    setOptions(options = {}) {
        this.options = Object.assign(this.options, options);
    }
    /**
     * Set item
     *
     * @param {string} name
     * @param {*} value
     * @param {number} expire - seconds
     */
    set(name, value, expire = null) {
        const stringifyValue = JSON.stringify({
            value,
            expire: expire !== null ? new Date().getTime() + expire : null,
        });
        this.storage.setItem(this.options.namespace + name, stringifyValue);
    }
    /**
     * Get item
     *
     * @param {string} name
     * @param {*} def - default value
     * @returns {*}
     */
    get(name, def = null) {
        const item = this.storage.getItem(this.options.namespace + name);
        if (item !== null) {
            try {
                const data = JSON.parse(item);
                if (data.expire === null) {
                    return data.value;
                }
                if (data.expire >= new Date().getTime()) {
                    return data.value;
                }
                this.remove(name);
            }
            catch (err) {
                return def;
            }
        }
        return def;
    }
    /**
     * Get item by key
     *
     * @param {number} index
     * @return {*}
     */
    key(index) {
        return this.storage.key(index);
    }
    /**
     * Remove item
     *
     * @param {string} name
     * @return {boolean}
     */
    remove(name) {
        return this.storage.removeItem(this.options.namespace + name);
    }
    /**
     * Clear storage
     */
    clear() {
        if (this.length === 0) {
            return;
        }
        const removedKeys = [];
        for (let i = 0; i < this.length; i++) {
            const key = this.storage.key(i);
            const regexp = new RegExp(`^${this.options.namespace}.+`, 'i');
            if (regexp.test(key) === false) {
                continue;
            }
            removedKeys.push(key);
        }
        for (const key in removedKeys) {
            this.storage.removeItem(removedKeys[key]);
        }
    }
    /**
     * Add storage change event
     *
     * @param {string} name
     * @param {Function} callback
     */
    on(name, callback) {
        WebStorageEvent.on(this.options.namespace + name, callback);
    }
    /**
     * Remove storage change event
     *
     * @param {string} name
     * @param {Function} callback
     */
    off(name, callback) {
        WebStorageEvent.off(this.options.namespace + name, callback);
    }
}

// eslint-disable-next-line
const _global = (typeof window !== 'undefined' ? window : global || {});
/**
 * @type {{install: (function(Object, Object): WebStorage)}}
 */
const VueStorage = {
    useStorage(options) {
        const _options = Object.assign(Object.assign({}, options), { storage: options.storage || 'local', name: options.name || 'ls' });
        if (_options.storage && ['memory', 'local', 'session'].indexOf(_options.storage) === -1) {
            throw new Error(`Vue-ls: Storage "${_options.storage}" is not supported`);
        }
        let store = null;
        switch (_options.storage) { // eslint-disable-line
            case 'local':
                try {
                    store = 'localStorage' in _global
                        ? _global.localStorage
                        : null;
                }
                catch (e) {
                    // In some situations the browser will
                    // throw a security exception when attempting to access
                }
                break;
            case 'session':
                try {
                    store = 'sessionStorage' in _global
                        ? _global.sessionStorage
                        : null;
                }
                catch (e) {
                    // In some situations the browser will
                    // throw a security exception when attempting to access
                }
                break;
            case 'memory':
                store = MemoryStorage;
                break;
        }
        if (!store) {
            store = MemoryStorage;
            // eslint-disable-next-line
            console.error(`Vue-ls: Storage "${_options.storage}" is not supported your system, use memory storage`);
        }
        const ls = new WebStorage(store);
        ls.setOptions(Object.assign(ls.options, {
            namespace: '',
        }, _options || {}));
        return { ls, _options };
    },
    /**
     * Install plugin
     *
     * @param {Object} Vue
     * @param {Object} options
     * @returns {WebStorage}
     */
    instance(options = {}) {
        const { ls, _options } = this.useStorage(options);
        // Vue[_options.name] = ls; // eslint-disable-line
        return ls;
        // Object.defineProperty(Vue.prototype || Vue.config.globalProperties, `$${_options.name}`, {
        //   /**
        //    * Define $ls property
        //    *
        //    * @return {WebStorage}
        //    */
        //   get() {
        //     return ls;
        //   },
        // });
    },
    install(Vue, options = {}) {
        const { ls, _options } = this.useStorage(options);
        // Vue[_options.name] = ls; // eslint-disable-line
        Vue.prototype[`$${_options.name}`] = ls;
    },
};
// eslint-disable-next-line
_global.VueStorage = VueStorage;

export { VueStorage as default };

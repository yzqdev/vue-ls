import {MemoryStorage, WebStorage} from './storage';

// eslint-disable-next-line
const _global: any = (typeof window !== 'undefined' ? window : global || {});
export interface VuelsOptions {
    storage?:'local'|'session'|'memory'
    name?:string
    namespace?:string
}

/**
 * @type {{install: (function(Object, Object): WebStorage)}}
 */
const VueStorage = {

    useStorage(options: VuelsOptions):{ls:WebStorage,_options:VuelsOptions}  {
        const _options = {
            ...options,
            storage: options.storage || 'local',
            name: options.name || 'ls',
        };

        if (_options.storage && ['memory', 'local', 'session'].indexOf(_options.storage) === -1) {
            throw new Error(`Vue-ls: Storage "${_options.storage}" is not supported`);
        }

        let store = null;

        switch (_options.storage) { // eslint-disable-line
            case 'local':
                try {
                    store = 'localStorage' in _global
                        ? _global.localStorage
                        : null
                    ;
                } catch (e) {
                    // In some situations the browser will
                    // throw a security exception when attempting to access
                }
                break;

            case 'session':
                try {
                    store = 'sessionStorage' in _global
                        ? _global.sessionStorage
                        : null
                    ;
                } catch (e) {
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

        return {ls, _options};
    },
    /**
     * Install plugin
     *
     * @param {Object} Vue
     * @param {Object} options
     * @returns {WebStorage}
     */
    instance(options:VuelsOptions = {}):WebStorage {
        const {ls, _options} = this.useStorage(options);
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
    install(Vue,options:VuelsOptions = {}) {
        const {ls, _options} = this.useStorage(options);
        // Vue[_options.name] = ls; // eslint-disable-line

        Vue.prototype[`$${_options.name}`]=ls

    },
};

// eslint-disable-next-line
_global.VueStorage = VueStorage;

export default VueStorage;

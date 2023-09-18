import { WebStorage } from './storage';
export interface VuelsOptions {
    storage?: 'local' | 'session' | 'memory';
    name?: string;
    namespace?: string;
}
/**
 * @type {{install: (function(Object, Object): WebStorage)}}
 */
declare const VueStorage: {
    useStorage(options: VuelsOptions): {
        ls: WebStorage;
        _options: {
            storage: "local" | "session" | "memory";
            name: string;
            namespace?: string;
        };
    };
    /**
     * Install plugin
     *
     * @param {Object} Vue
     * @param {Object} options
     * @returns {WebStorage}
     */
    instance(options?: VuelsOptions): any;
    install(Vue: any, options?: VuelsOptions): void;
};
export default VueStorage;

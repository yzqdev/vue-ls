/**
 * Storage Bridge
 */
export declare class WebStorage {
    private storage;
    options: {
        namespace: string;
        events: string[];
    };
    private length;
    /**
     * @param {Object} storage
     */
    constructor(storage: Storage);
    /**
     * Set Options
     *
     * @param {Object} options
     */
    setOptions(options?: {}): void;
    /**
     * Set item
     *
     * @param {string} name
     * @param {*} value
     * @param {number} expire - seconds
     */
    set(name: any, value: any, expire?: any): void;
    /**
     * Get item
     *
     * @param {string} name
     * @param {*} def - default value
     * @returns {*}
     */
    get(name: any, def?: any): any;
    /**
     * Get item by key
     *
     * @param {number} index
     * @return {*}
     */
    key(index: any): string;
    /**
     * Remove item
     *
     * @param {string} name
     * @return {boolean}
     */
    remove(name: any): void;
    /**
     * Clear storage
     */
    clear(): void;
    /**
     * Add storage change event
     *
     * @param {string} name
     * @param {Function} callback
     */
    on(name: any, callback: any): void;
    /**
     * Remove storage change event
     *
     * @param {string} name
     * @param {Function} callback
     */
    off(name: any, callback: any): void;
}

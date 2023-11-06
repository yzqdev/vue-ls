declare class MemoryStorageInterface {
    constructor();
    /**
     * Get item
     *
     * @param {string} name
     * @returns {*}
     */
    getItem(name: any): any;
    /**
     * Set item
     *
     * @param {string} name
     * @param {*} value
     * @returns {boolean}
     */
    setItem(name: any, value: any): boolean;
    /**
     * Remove item
     *
     * @param {string} name
     * @returns {boolean}
     */
    removeItem(name: any): boolean;
    /**
     * Clear storage
     *
     * @returns {boolean}
     */
    clear(): boolean;
    /**
     * Get item by key
     *
     * @param {number} index
     * @returns {*}
     */
    key(index: any): string;
}
declare const MemoryStorage: MemoryStorageInterface;
export { MemoryStorage };

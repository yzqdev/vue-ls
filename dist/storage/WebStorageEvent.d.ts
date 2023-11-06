/**
 * Event class
 */
export declare class WebStorageEvent {
    /**
     * Add storage change event
     *
     * @param {string} name
     * @param {Function} callback
     */
    static on(name: any, callback: any): void;
    /**
     * Remove storage change event
     *
     * @param {string} name
     * @param {Function} callback
     */
    static off(name: any, callback: any): void;
    /**
     * Emit event
     *
     * @param {Object} event
     */
    static emit(event: any): void;
}

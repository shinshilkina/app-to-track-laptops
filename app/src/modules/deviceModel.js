import {sendHttpRequest} from './requests';

class deviceModel {
    /**
     * @param {{id: number, device: string, type: string, housing: string}} data
     */
    constructor(data) {
        /**
         * @type {number}
         * @private
         */
        this._id = -1;
        /**
         * @type {string}
         * @private
         */
        //id_employee, id_office, manufacturer, model, serial_number, inventory_number, date_added,
        //             write_off_date, description, OS,status, depreciation, depreciation_lenght
        this._id_employee = '';
        /**
         * @type {number}
         * @private
         */
        this._housing = '';
        /**
         * @type {string}
         * @private
         */
        this._type = '';

        this.parse(data);

        /**
         * @type {boolean}
         * @private
         */
        this._isDraft = this.isNew();
    }

    /**
     * @param {{id: number, device: string, type: string, housing: string}} data
     */
    parse(data) {
        this.id = data.id;
        this.device = data.device;
        this.type = data.type;
        this.housing = data.housing;
    }

    /**
     * @return {{housing: string, id: number, device: string, type: string}}
     */
    toObject() {
        return {
            id: this.id,
            device: this.device,
            type: this.type,
            housing: this.housing
        };
    }

    /**
     * @return {number}
     */
    get id() {
        return this._id;
    }

    /**
     * @param {number} val
     */
    set id(val) {
        this._isDraft = this._isDraft || this._id !== val;
        this._id = val;
    }

    /**
     * @return {string}
     */
    get device() {
        return this._device;
    }

    /**
     * @param {string} val
     */
    set device(val) {
        this._isDraft = this._isDraft || this._device !== val;
        this._device = val;
    }

    /**
     * @return {string}
     */
    get housing() {
        return this._housing;
    }

    /**
     * @param {string} val
     */
    set housing(val) {
        this._isDraft = this._isDraft || this._housing !== val;
        this._housing = val;
    }

    /**
     * @return {string}
     */
    get type() {
        return this._type;
    }

    /**
     * @param {string} val
     */
    set type(val) {
        this._isDraft = this._isDraft || this._type !== val;
        this._type = val;
    }

    /**
     * @return {boolean}
     */
    isNew() {
        return this.id === -1;
    }

    /**
     * @return {boolean}
     */
    isDraft() {
        return this._isDraft;
    }

    /**
     */
    markAsSaved() {
        this._isDraft = false;
    }
}


class deviceTransport {
    /**
     * @param {string} baseURL
     */
    constructor(baseURL) {
        /**
         * @type {string}
         * @private
         */
        this._baseURL = baseURL + 'device/';
    }

    /**
     * @return {Promise<Array<deviceModel>>}
     */
    list() {
        return sendHttpRequest('GET', this._baseURL)
            .then(responseData => responseData.map((data) => new deviceModel(data)));
    }

    /**
     * @param {number} id
     * @return {Promise<deviceModel>}
     */
    get(id) {
        return sendHttpRequest('GET', this._baseURL + id)
            .then(responseData => new deviceModel(responseData));
    }

    /**
     * @param {deviceModel} device
     * @return {Promise<deviceModel>}
     */
    save(device) {
        const isNew = device.isNew();
        const method = isNew ? 'POST' : 'PUT';
        const postfix = isNew ? '' : device.id;
        return sendHttpRequest(method, this._baseURL + postfix, device.toObject())
            .then((response) => {
                if (isNew) {
                    device.id = response.id;
                }
                device.markAsSaved();
                return device;
            });
    }

    /**
     * @param {deviceModel|number} deviceOrId
     * @return {Promise<deviceModel|number>}
     */
    delete(deviceOrId) {
        const id = deviceOrId instanceof deviceModel ? deviceOrId.id : deviceOrId;
        return sendHttpRequest('DELETE', this._baseURL + id)
            .then(() => {
                if (deviceOrId instanceof deviceModel) {
                    deviceOrId.id = -1;
                }
                return deviceOrId;
            });
    }

    /**
     * @return {deviceModel}
     */
    new() {
        return new deviceModel({id: -1, housing: '', type: '', device: ''});
    }
}

export {deviceModel, deviceTransport};

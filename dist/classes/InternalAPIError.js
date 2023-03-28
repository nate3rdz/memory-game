export default class InternalAPIError extends Error {
    status;
    message;
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
    }
}
//# sourceMappingURL=InternalAPIError.js.map
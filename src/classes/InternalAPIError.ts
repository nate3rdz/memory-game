export default class InternalAPIError extends Error {
    public status;
    public message;

    constructor(message: string, status: number) {
        super(message);

        this.message = message;
        this.status = status;
    }
}
export class SubscriptionError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
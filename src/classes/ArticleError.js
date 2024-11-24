export class ArticleError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
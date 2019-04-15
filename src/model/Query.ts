export class Query<R extends object> {
    protected constructor(public readonly url: string, public readonly responseCtor: new () => R) {
    }
}

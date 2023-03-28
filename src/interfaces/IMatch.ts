export default interface IMatch {
    user: string | object;
    closed: boolean;
    createdAt: number;
    closedAt?: number;
};
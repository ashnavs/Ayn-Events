export interface IUser {
    name?: string;
    email?: string;
    password?: string;
    favorites?: string[];
    is_verified?: boolean;
    is_google?: boolean;
}
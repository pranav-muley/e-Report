export type LoginResponse = {
    success : boolean;
    accessToken: string;
    user: UserInfo
}

type UserInfo = {
    id : string;
    name: string;
    role: string
}
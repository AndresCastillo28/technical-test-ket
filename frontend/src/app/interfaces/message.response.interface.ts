export interface MessageInterface {
    _id:     string;
    message: string;
    user:    User;
    date:    Date;
    __v:     number;
}

export interface User {
    _id:   string;
    name:  string;
    email: string;
    role:  Role;
}

export interface Role {
    _id:  string;
    name: string;
}
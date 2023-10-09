export interface User {
    id: string;
    email: string;
    password: string;
    name:string;
  }

export interface CreateNewUserDTO extends Omit<User, "id"> {}
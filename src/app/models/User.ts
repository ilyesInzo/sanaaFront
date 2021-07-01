import {Authority} from '@app/models/Authority'

export interface User {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    authorities: { [key: string]: Authority }
}
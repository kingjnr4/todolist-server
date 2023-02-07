import { User as AuthUser} from "@prisma/client"

export {}
declare global{
    namespace Express {
        export interface Request{
            authUser: AuthUser
        }
    }
}
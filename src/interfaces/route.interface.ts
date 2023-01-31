import { Router } from "express";

export interface AppRoutes {
    path?: string,
    router: Router,
    initializeRoutes:()=>void
}
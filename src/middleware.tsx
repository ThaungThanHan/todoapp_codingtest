import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import Cookies from "js-cookie";


export function  middleware(request:NextRequest){
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/login" || path === "/signup";
    const token = request?.cookies?.get('authToken')?.value || "";
    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/',request.nextUrl));
    }
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/login',request.nextUrl));
    } 
}

export const config = {        // add paths as matcher.
    matcher:[
        '/',
        '/login',
        '/signup'
    ],
}
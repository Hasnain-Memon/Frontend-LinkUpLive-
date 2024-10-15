"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";

interface AuthWrapper{
    children: ReactNode;
}

export const AuthWrapper: FC<AuthWrapper> = ({ children }) => {

    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status = "authenticated") {
            router.push('/dashboard');
        }
    }, [session.status, router]);

    return <>
        { children }
    </>;
}
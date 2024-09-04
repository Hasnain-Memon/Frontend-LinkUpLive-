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
        if (session.status = "unauthenticated") {
            router.push('/landing');
        }
    }, [session.status, router]);

    if(session.status === "loading"){
        return <div>loading...</div>
    };

    return <>
        {session.data ? children : null}
    </>;
}
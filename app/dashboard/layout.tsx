import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { ReactNode } from "react";
import { requireUser } from "../utils/hooks";

export default async function DashboardLayout({children}:{children:ReactNode}) {
    const session = await requireUser();
    return (
        <>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex flex-col max-h-screen h-full gap-2">
                        <div className="h-14 flex items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link href="/" className="flex items-center gap-2">
                                <Image src={Logo} alt="Logo" className="size-10" />
                                <p className="text-2xl font-bold">
                                    Invoice<span className="text-blue-800">Cristian</span>
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
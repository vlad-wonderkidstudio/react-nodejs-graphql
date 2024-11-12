import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type React from "react";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const activeLinkClasses = 'text-black rounded-t-lg border-solid border-x-2 border-t-2 border-indigo-100';
  const inactiveLinkClasses = 'text-blue-500';

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>DevBird Full-Stack Product Engineer</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>

      <div className="flex items-center justify-center border-b py-2">
        <div className="font-semibold text-lg">
          DevBird Full-Stack Product Engineer
        </div>
      </div>

      <div className="border-b">
        <div className="flex items-center gap-4 container mx-auto pt-2">
          <Link
            className={ 'py-1 px-4 ' 
              + (['/', '/documents'].includes(router.pathname) 
                ? activeLinkClasses
                : inactiveLinkClasses
            )}
            href="/documents"
          >
            Documents
          </Link>
          <Link
            className={ 'py-1 px-4 ' 
              + (router.pathname === '/people' 
                ? activeLinkClasses
                : inactiveLinkClasses
            )}
            href="/people"
          >
            People
          </Link>
        </div>
      </div>

      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
};

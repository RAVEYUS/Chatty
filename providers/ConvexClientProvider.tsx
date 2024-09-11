"use client"
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { Authenticated, AuthLoading, ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { dark } from '@clerk/themes'
import React, { Children } from 'react'
import {
  SignInButton,
  SignedIn,
  SignUp,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Loadinglogo from '@/components/shared/Loadinglogo';

type Props = {
  children: React.ReactNode;
};

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || ""
const convex = new ConvexReactClient(CONVEX_URL)
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''


export const ConvexClientProvider = ({ children }: Props) => {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }} publishableKey={publishableKey}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <Authenticated>
          {children}
        </Authenticated>
        <AuthLoading>
          <Loadinglogo />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
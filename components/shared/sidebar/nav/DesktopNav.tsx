"use client";
import { useNavigation } from '@/hooks/useNavigation';
import { Card } from '@/components/ui/card';
import React from 'react'
import { UserButton } from '@clerk/nextjs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ModeToggle } from '@/components/ui/theme/theme-toggle';
import { Badge } from '@/components/ui/badge';

type Props = {}

const Desktopnav = () => {
  const path = useNavigation();
  return (
    <Card className='hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4'>
      <nav>
        <ul className='flex flex-col items-center gap-4'>
          {
            path.map((path, id) => {
              return <li key={id} className='relative'>
                <Link href={path.href}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button size="icon" variant={path.active ? "default" : "outline" }>
                        {path.icon}
                      </Button>
                      {path.count ? <Badge className='absolute left-6 px-2 bottom-7'>
                        {path.count}
                      </Badge>: null }
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {path.name}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </li>
            })}
        </ul>
      </nav>
      <div className='flex flex-col items-center gap-4'>
        <ModeToggle/>
        <UserButton />
      </div>
    </Card>
  )
}

export default Desktopnav
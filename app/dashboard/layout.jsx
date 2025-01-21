"use client"

import { Skeleton } from '@/components/ui/skeleton'
import React, { Suspense } from 'react'
// import Loading from './loading'

function layout({children}) {
  return (
    <div>
        <Suspense fallback={<Skeleton  className="w-[100px] h-[20px] rounded-full"/>}>

        {children}
        </Suspense>
    </div>
  )
}

export default layout
import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'border-transparent bg-primary-600 text-white hover:bg-primary-700': variant === 'default',
          'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
          'border-transparent bg-danger-600 text-white hover:bg-danger-700': variant === 'destructive',
          'text-gray-950': variant === 'outline',
          'border-transparent bg-success-100 text-success-800': variant === 'success',
          'border-transparent bg-warning-100 text-warning-800': variant === 'warning',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
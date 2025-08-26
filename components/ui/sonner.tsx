"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: '#ffffff',
          color: '#374151',
          border: '1px solid #e5e7eb',
        },
        descriptionClassName: '!text-slate-500',
        classNames: {
          success: 'success-toast',
          error: 'error-toast',
          info: 'info-toast',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

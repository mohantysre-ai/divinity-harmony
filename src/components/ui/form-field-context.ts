import * as React from "react"

const FormFieldContext = React.createContext<{
  name: string
} | null>(null)

export function useFormField() {
  const context = React.useContext(FormFieldContext)

  if (!context) {
    throw new Error("useFormField should be used within <FormField>")
  }

  return context
}

export { FormFieldContext }

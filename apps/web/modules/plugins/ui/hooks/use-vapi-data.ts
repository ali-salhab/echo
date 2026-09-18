import { useAction } from "convex/react"
import { useEffect, useState } from "react"
import { api } from "@workspace/backend/_generated/api"
import toast from "react-hot-toast"
type PhoneNumbers = typeof api.private.vapi.getPhoneNumbers._returnType
type Assistants = typeof api.private.vapi.getAssistants._returnType
export const useVapiPhoneNumbers = (): {
  data: PhoneNumbers
  isLoading: boolean
  error: Error | null
} => {
  const [data, setData] = useState<PhoneNumbers>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers)
  // Run this code after the component mounts.
  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const result = await getPhoneNumbers()
        if (cancelled) return
        setData(result)
        setError(null)
      } catch (err) {
        setError(err as Error)
        if (cancelled) return
        toast.error((err as Error).message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, isLoading: isLoading, error }
}

export const useVapiAssistants = (): {
  data: Assistants
  isLoading: boolean
  error: Error | null
} => {
  let cancelled = false
  const [data, setData] = useState<Assistants>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const getAssistants = useAction(api.private.vapi.getAssistants)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const result = await getAssistants()
        if (cancelled) return
        setData(result)
        setError(null)
      } catch (err) {
        setError(err as Error)
        toast.error((err as Error).message)
      } finally {
        if (cancelled) return
        setIsLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, isLoading, error }
}

import { useAction } from "convex/react"
import { useEffect, useState } from "react"
import { api } from "@workspace/backend/_generated/api"
type PhoneNumber = typeof api.private.vapi.getPhoneNumbers._returnType
export const useVapiPhoneNumbers = () => {
  const [data, setData] = useState<PhoneNumber>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getPhoneNumbers()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err as Error)
        toast.error((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [getPhoneNumbers])

  return { data, loading, error }
}

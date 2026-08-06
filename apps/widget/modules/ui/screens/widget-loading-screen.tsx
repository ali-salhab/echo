import React, { useEffect, useState } from "react"
// notice that when we are using useSetAtom , React will not re-render the component when the atom value changes. This is useful for cases where we want to update the atom value without causing unnecessary re-renders of the component.
import { useAtomValue, useSetAtom } from "jotai"
import { Loader2Icon } from "lucide-react"
import type { Id } from "@workspace/backend/_generated/dataModel"
import { api } from "@workspace/backend/_generated/api"
import {
  contactSessionIdAtomFamilly,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../widget/atoms/widget-atoms"
import { WidgetHeader } from "../components/widget-header"
import { useAction, useMutation } from "convex/react"
import { set } from "zod"

type InitStep = "org" | "session" | "setting" | "vapi" | "done"
const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null
}) => {
  const setErrorMessage = useSetAtom(errorMessageAtom)
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamilly(organizationId ?? "")
  )
  const setOrganizationId = useSetAtom(organizationIdAtom)
  const setScreen = useSetAtom(screenAtom)
  const loadingMessage = useAtomValue(loadingMessageAtom)
  const setLoadingMessage = useSetAtom(loadingMessageAtom)
  const [step, setStep] = useState<InitStep>("org")
  const [sessionValid, setSessionValid] = useState<Boolean>(false)
  const validateOrganization = useAction(api.public.organizations.validate)
  // step 1: validate organization id
  useEffect(() => {
    if (step !== "org") {
      return
    }
    setLoadingMessage("loading organization id ")
    if (!organizationId) {
      setErrorMessage("organization id is required")
      setScreen("error")
      return
    }
    setLoadingMessage("verifying organization. ....")

    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId)
          setStep("session")
        } else {
          setErrorMessage(result.error ?? "invalid configuration")
          setScreen("error")
        }
      })
      .catch(() => {
        setErrorMessage("unable to verify organization")
        setScreen("error")
      })
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
    validateOrganization,
    setLoadingMessage,
  ])
  // step 2: validate session
  const validateContactSession = useMutation(
    api.public.contcactSession.validate
  )
  useEffect(() => {
    if (step !== "session") {
      return
    }
    setLoadingMessage("finding contact session id ..")

    if (!contactSessionId) {
      setSessionValid(false)
      setStep("done")
      return
    }
    setLoadingMessage("validating swssion..")
    validateContactSession({
      contactSessionId: contactSessionId as Id<"contactSessions">,
    })
      .then((result) => {
        setSessionValid(result.valid)
        setStep("done")
      })
      .catch(() => {
        setSessionValid(false)
        setStep("done")
      })
  }, [step, contactSessionId, setLoadingMessage, validateContactSession])
  useEffect(() => {
    if (step !== "done") {
      return
    }
    const hasValidSession = contactSessionId && sessionValid
    setScreen(hasValidSession ? "selection" : "auth")
  }, [step, contactSessionId, sessionValid, setScreen])
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between px-2 py-1">
          <p className="text-3xl font-semibold">hey there👌 </p>
          <p className="font-ligth text-lg"> let &apos; s get you started </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <Loader2Icon className="animate-spin"></Loader2Icon>
        <p className="capitalize">{loadingMessage ?? "loading....."}</p>
      </div>
    </>
  )
}

export default WidgetLoadingScreen

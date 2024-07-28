import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import React, { createContext, useContext, useState } from "react"

type ConfirmFunction = () => void

interface DialogOptions {
  title: string
  body: React.ReactNode
  confirmLabel: string
  onConfirm: ConfirmFunction
  cancelLabel?: string
  onClose?: (_event: object, reason: string) => void
  onCancel?: () => void
}

type ShowDialogHandler = (options: DialogOptions) => void

const DialogContext = createContext<ShowDialogHandler>(() => {
  throw new Error("Component is not wrapped with a DialogProvider.")
})

const initValues: DialogOptions = {
  title: "",
  confirmLabel: "",
  body: "",
  onConfirm: () => {},
  onClose: undefined,
  onCancel: undefined,
}

const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<DialogOptions>(initValues)
  const showDialog: ShowDialogHandler = (options) => {
    setOptions({ ...initValues, ...options })
    setIsOpen(true)
  }
  const handleConfirm = () => {
    options.onConfirm()
    setIsOpen(false)
  }
  const handleCancel = () => {
    options.onCancel && options.onCancel()
    setIsOpen(false)
  }

  const handleClose = (_event: object, reason: string) => {
    if (options.onClose) {
      options.onClose(_event, reason)
      setIsOpen(false)
    } else {
      handleCancel()
    }
  }

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{options.title}</DialogTitle>
        <DialogContent>{options.body}</DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{options.cancelLabel}</Button>
          <Button onClick={handleConfirm} variant="contained" autoFocus>
            {options.confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
      <DialogContext.Provider value={showDialog}>
        {children}
      </DialogContext.Provider>
    </>
  )
}

export const useDialog = () => {
  return useContext(DialogContext)
}

export default DialogProvider

"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { Pencil, Check, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditableFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Display label for the field. */
  label: string
  /** Starting value rendered in read-only mode. */
  initialValue: string
  /** Async callback triggered when the user confirms a new value. */
  onSave?: (value: string) => Promise<void> | void
}

/**
 * Inline-editable form field.
 * Transitions between a read-only display and an active Input,
 * with Save / Cancel actions and keyboard shortcuts (Enter / Escape).
 */
export function EditableField({
  label,
  id,
  initialValue,
  onSave,
  className,
  ...props
}: Readonly<EditableFieldProps>) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isEditing) {
      setValue(initialValue)
    }
  }, [initialValue, isEditing])

  /** Opens edit mode and sets focus on the next tick. */
  const startEditing = useCallback(() => {
    setIsEditing(true)
    // Focus is deferred so the Input is mounted before we try to focus it.
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  /** Confirms the edit by calling onSave when the value changed. */
  const handleSave = useCallback(async () => {
    if (value === initialValue) {
      setIsEditing(false)
      return
    }

    if (!onSave) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      await onSave(value)
      setIsEditing(false)
    } finally {
      setIsLoading(false)
    }
  }, [value, initialValue, onSave])

  /** Reverts the value and exits edit mode. */
  const handleCancel = useCallback(() => {
    setValue(initialValue)
    setIsEditing(false)
  }, [initialValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave()
    if (e.key === "Escape") handleCancel()
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id} className="text-muted-foreground">
        {label}
      </Label>
      <div className="relative flex items-center group">
        <Input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={!isEditing}
          disabled={isLoading}
          className={cn(
            "pl-4 pr-20 transition-all duration-300 rounded-lg",
            isEditing 
              ? "border-primary bg-background shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
              : "border-transparent bg-muted/40 shadow-none focus-visible:ring-0 cursor-default hover:bg-muted/60" 
          )}
          {...props}
        />

        <div className="absolute right-1 flex items-center gap-1">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Annuler</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                onClick={handleSave}
                disabled={isLoading}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Sauvegarder</span>
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity"
              onClick={startEditing}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Modifier {label}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { UploadCloud, FileImage, CheckCircle2, Trash2, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface AvatarUploadDialogProps {
  onUploadSuccess?: (file: File) => void
}

type UploadState = "idle" | "uploading" | "success"

export function AvatarUploadDialog({ onUploadSuccess }: Readonly<AvatarUploadDialogProps>) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<UploadState>("idle")
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)

  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const clearUploadInterval = useCallback(() => {
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current)
      uploadIntervalRef.current = null
    }
  }, [])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && state === "uploading") {
      // Prevent closing while uploading to protect the state
      return
    }
    setOpen(newOpen)
    if (!newOpen) {
      clearUploadInterval()
      // Reset state gracefully after dialog exit animation
      setTimeout(() => {
        setState("idle")
        setProgress(0)
        setFile(null)
      }, 300)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      // Basic client-side validation
      if (!selectedFile.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image valide.")
        return
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("L'image est trop volumineuse (max 5MB).")
        return
      }
      
      setFile(selectedFile)
      startSimulatedUpload()
    }
  }

  const startSimulatedUpload = () => {
    clearUploadInterval()
    setState("uploading")
    setProgress(0)
    
    // Simulate upload progress for UI/UX demonstration
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        setTimeout(() => {
          setState("success")
        }, 500)
      }
      setProgress(currentProgress)
    }, 300)
  }

  const handleClear = () => {
    setFile(null)
    setProgress(0)
    setState("idle")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
  
  const handleFinalUpload = () => {
    if (file && onUploadSuccess) {
      onUploadSuccess(file)
    }
    setOpen(false)
  }

  useEffect(() => {
    return () => clearUploadInterval()
  }, [clearUploadInterval])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hidden sm:flex transition-all hover:bg-primary hover:text-primary-foreground">
          Changer l&apos;avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="mb-4 text-center sm:text-left">
          <DialogTitle className="text-xl">Modifier l&apos;avatar</DialogTitle>
          <DialogDescription>
            Uploadez une photo de vous pour mettre à jour votre profil.
          </DialogDescription>
        </DialogHeader>

        {/* Fixed height container for smooth transitions without structural layout shift */}
        <div className="min-h-[260px] flex flex-col justify-center gap-4">
          
          {/* STEP 1: IDLE */}
          {state === "idle" && (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/5 transition-colors">
              <button
                type="button"
                className="flex flex-col items-center justify-center w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer group p-2 -mt-2 -mx-2 hover:bg-muted/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-foreground">Cliquez pour ajouter une photo</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG (max. 5MB)</p>
              </button>
              
              <div className="flex items-center w-full gap-4 my-6">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs text-muted-foreground font-medium uppercase">OU</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              
              <Button 
                type="button" 
                variant="default" // Using green_trade's primary color (green) rather than blue
                className="w-full shadow-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute("capture", "user")
                    fileInputRef.current.click()
                    setTimeout(() => fileInputRef.current?.removeAttribute("capture"), 1000)
                  }
                }}
              >
                <Camera className="mr-2 h-4 w-4" />
                Ouvrir la caméra
              </Button>
            </div>
          )}

          {/* STEP 2: UPLOADING */}
          {state === "uploading" && (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/5 h-[286px] animate-in fade-in zoom-in-95 duration-300">
              <div className="p-3 bg-primary/10 rounded-lg mb-6">
                <FileImage className="h-10 w-10 text-primary" />
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="truncate max-w-[200px] text-foreground">{file?.name}</span>
                  <span className="text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center animate-pulse mt-4">
                  Envoi en cours...
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {state === "success" && (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 h-[286px] animate-in fade-in zoom-in-95 duration-300 transition-all">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary animate-in zoom-in-50 duration-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <p className="font-semibold text-foreground">Upload terminé</p>
              <p className="text-sm text-muted-foreground truncate max-w-[200px] mt-1 mb-6">
                {file?.name}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                className="text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Effacer l&apos;envoi
              </Button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
          />
        </div>

        <DialogFooter className="mt-2 flex flex-col sm:flex-row gap-2">
          {state !== "uploading" && (
            <DialogClose asChild>
              <Button variant="ghost" className="sm:mr-auto text-muted-foreground">Plus tard</Button>
            </DialogClose>
          )}
          
          <Button 
            disabled={state !== "success"} 
            className={cn(
              "w-full sm:w-auto transition-all", 
              state === "success" && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            onClick={handleFinalUpload}
          >
            Sauvegarder l&apos;avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

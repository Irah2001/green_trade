import type { Metadata } from "next"

import SettingsSidebar from "@/components/layout/SettingsSidebar"
import Navbar from "@/components/layout/Navbar"

export const metadata: Metadata = {
  title: "Paramètres | Green Trade",
  description: "Gérez vos paramètres de compte, profil et préférences.",
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: Readonly<SettingsLayoutProps>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 font-poppins">
      <Navbar />
      <main className="flex min-h-[calc(100vh-(--spacing(16)))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Paramètres</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
          <SettingsSidebar />
          <div className="grid gap-6">{children}</div>
        </div>
      </main>
    </div>
  )
}

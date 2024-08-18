import { ReactNode } from "react"

import { fonts } from "@/lib/fontApp"

import TopNav from "./topNav"

type AppLayoutProps = { children: ReactNode }

const AppLayout = ({ children }: AppLayoutProps) => (
  <div className={`${fonts} relative h-screen`}>
    <div className="flex min-h-screen w-full flex-col bg-[#5a189a]/70">
      <div className="flex flex-col">
        <TopNav />
        <main>{children}</main>
      </div>
    </div>
  </div>
)

export default AppLayout

import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import ConnectButton from "../web3/connectButton"
import { Package2 } from "lucide-react"

const HeaderSection = () => {
  return (
    <>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/"
                className="flex items-center gap-4 text-lg font-semibold md:text-base"
              >
                <Package2 className="h-6 w-6" />
                <span>SheLeads</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
const TopNav = () => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 justify-between">
      <HeaderSection />
      <ConnectButton />
    </header>
  )
}

export default TopNav

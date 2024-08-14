import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const SheLeadsModule = buildModule("SheLeadsModule", (m) => {
  const sheLeads = m.contract("SheLeads")

  return { sheLeads }
})

export default SheLeadsModule

import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { assert } from "chai"
import { ethers } from "hardhat"

describe("SheLeads", function () {
  async function deploySheLeads() {
    const [owner, account1, account2] = await ethers.getSigners()

    const SheLeads = await ethers.getContractFactory("SheLeads")

    const sheLeads = await SheLeads.deploy()

    return { sheLeads, owner, account1, account2 }
  }

  describe("Basic Test", () => {})
})

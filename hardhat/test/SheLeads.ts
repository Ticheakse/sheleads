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

  describe("Basic Test", () => {
    it("Add Professional Profile", async () => {
      const { sheLeads } = await loadFixture(deploySheLeads)

      let content = "123-1323DSR"

      await sheLeads.addProfessionalProfile(content)

      const pp = await sheLeads.getProfessionalProfile()

      assert.equal(pp.content, content)
    })
    it("Add Recomendation", async () => {
      const { sheLeads } = await loadFixture(deploySheLeads)

      let content = "123-1323DSR"

      await sheLeads.addProfessionalProfile(content)

      const pp = await sheLeads.getProfessionalProfile()

      assert.equal(pp.content, content)

      content = "885553366"

      await sheLeads.addRecomendation(pp.id, content)

      const rec = await sheLeads.getRecomendation(pp.id)

      assert.equal(rec.content, content)
    })
  })
})

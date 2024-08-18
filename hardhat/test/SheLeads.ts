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

      await sheLeads.addRecommendation(pp.id, content)

      const rec = await sheLeads.getRecommendation(pp.id)

      assert.equal(rec.content, content)
    })

    it("Add ActionPlan", async () => {
      const { sheLeads } = await loadFixture(deploySheLeads)

      let content = "123-1323DSR"

      await sheLeads.addProfessionalProfile(content)

      const pp = await sheLeads.getProfessionalProfile()

      assert.equal(pp.content, content)

      content = "885553366"

      await sheLeads.addRecommendation(pp.id, content)

      const rec = await sheLeads.getRecommendation(pp.id)

      content = "885553DSF366"

      await sheLeads.addActionPlan(rec.id, content)

      // const ap = await sheLeads.getActionPlan(rec.id)

      // assert.equal(ap.content, content)
    })
  })
})

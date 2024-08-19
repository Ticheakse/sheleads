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

    it("get recommendations", async () => {
      const { sheLeads } = await loadFixture(deploySheLeads)

      let content = "123-1323DSR"

      await sheLeads.addProfessionalProfile(content)

      let pp = await sheLeads.getProfessionalProfile()
      console.log('pp.id :>> ', pp.id);
      
      content = "885553366"

      await sheLeads.addRecommendation(pp.id, content)

      let rec = await sheLeads.getRecommendation(pp.id)

      // assert.equal(pp.content, content)
      
      content = "2334987"
      
      await sheLeads.addProfessionalProfile(content)
      
      pp = await sheLeads.getProfessionalProfile()
      console.log('pp.id :>> ', pp.id);


      content = "23rverv45"

      await sheLeads.addRecommendation(pp.id, content)

      content = "33333333"
      
      await sheLeads.addProfessionalProfile(content)
      pp = await sheLeads.getProfessionalProfile()
      console.log('pp.id :>> ', pp.id);
      console.log('pp.createdAt :>> ', pp.createdAt);
      content = "4563453"
      
      await sheLeads.addProfessionalProfile(content)
      pp = await sheLeads.getProfessionalProfile()
      console.log('pp.id :>> ', pp.id);
      console.log('pp.createdAt :>> ', pp.createdAt);
      content = "456<sdv<ds3453"
      
      await sheLeads.addProfessionalProfile(content)
      pp = await sheLeads.getProfessionalProfile()
      console.log('pp.id :>> ', pp.id);
      console.log('pp.createdAt :>> ', pp.createdAt);
      pp = await sheLeads.getProfessionalProfile()
      
      content = "2112rv45"

      await sheLeads.addRecommendation(pp.id, content)
      content = "asdasd3423"
      
      await sheLeads.addProfessionalProfile(content)

      pp = await sheLeads.getProfessionalProfile()
      console.log('pp.id :>> ', pp.id);
      console.log('pp.createdAt :>> ', pp.createdAt);
      
      content = "23rve55rv45"

      await sheLeads.addRecommendation(pp.id, content)

      
      const rec2 = await sheLeads.getRecommendations()
      console.log("rec2 :>> ", rec2)
      
      
      // console.log("rec2 :>> ", rec2[0].id)
      // console.log("rec2 :>> ", rec2[1].id)

      // assert.equal(rec.content, content)
    })
  })
})

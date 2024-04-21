// sum.test.js
import { ApplianceFinderType } from "@/schema/questionsSchema";
import { createCaller } from "@/server";
import { prisma } from "@/server/prisma";
import { beforeEach, describe } from "node:test";
import { expect, it, test } from "vitest";

test("Hello says hello", async () => {
  const c = createCaller({});
  const r = await c.greeting();
  expect(r).toEqual("hello");
});

const caller = createCaller({});

describe("testHeaterRecommendations", () => {
  it("Base recommendation tests", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric", "Natural Gas"],
      ventType: null,
      heaterSpaceRestrictions: ["NONE"],
    };
    // We'll use this and manipulate
    const formSubmission = await prisma.userFormSubmission.create({
      data: {
        submissionData: userFormSubmission,
        createdAt: new Date(),
      },
    });

    const recs = await caller.getRecommendedHeaters({ id: formSubmission.id });
    await prisma.userFormSubmission.delete({
      where: {
        id: formSubmission.id,
      },
    });

    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408797");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    // expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408797");
  });

  it("2-person household recommendation tests", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 2,
      supportedEnergyTypes: ["Electric", "Natural Gas"],
      ventType: null,
      heaterSpaceRestrictions: ["NONE"],
    };
    // We'll use this and manipulate
    const formSubmission = await prisma.userFormSubmission.create({
      data: {
        submissionData: userFormSubmission,
        createdAt: new Date(),
      },
    });

    const recs = await caller.getRecommendedHeaters({ id: formSubmission.id });
    await prisma.userFormSubmission.delete({
      where: {
        id: formSubmission.id,
      },
    });

    // These are duplicated
    expect(
      recs.bestValueChoice.energyStarUniqueId === "2408815" ||
        recs.bestValueChoice.energyStarUniqueId === "2408805",
    ).toBeTruthy();
    console.log(recs.ourRecommendation.energyStarUniqueId);
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    // expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408797");
  });

  it("4-person household recommendation tests", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 4,
      supportedEnergyTypes: ["Electric", "Natural Gas"],
      ventType: null,
      heaterSpaceRestrictions: ["NONE"],
    };
    // We'll use this and manipulate
    const formSubmission = await prisma.userFormSubmission.create({
      data: {
        submissionData: userFormSubmission,
        createdAt: new Date(),
      },
    });

    const recs = await caller.getRecommendedHeaters({ id: formSubmission.id });
    await prisma.userFormSubmission.delete({
      where: {
        id: formSubmission.id,
      },
    });

    // These are duplicated
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("3387616");
    expect(recs.ourRecommendation.energyStarUniqueId).toEqual("3387616");
    // expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408797");
  });
});

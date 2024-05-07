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
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408797");
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
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    expect(
      recs.bestValueChoice.energyStarUniqueId === "2408815" ||
        recs.bestValueChoice.energyStarUniqueId === "2408805",
    ).toBeTruthy();
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
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408542");
  });

  it("6-person household recommendation tests", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 6,
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408762");
    expect(recs.ourRecommendation.energyStarUniqueId).toEqual("2408762");
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2508327");
  });

  it("Handles a FL zip code", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "33101",
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

    // These are duplicated
    expect(
      recs.bestValueChoice.energyStarUniqueId === "2408815" ||
        recs.bestValueChoice.energyStarUniqueId === "2408805",
    ).toBeTruthy();
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    expect(
      recs.bestValueChoice.energyStarUniqueId === "2408815" ||
        recs.bestValueChoice.energyStarUniqueId === "2408805",
    ).toBeTruthy();
  });

  it("Handles a CA zip code", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "99801",
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

    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("3387616");
    expect(recs.ourRecommendation.energyStarUniqueId).toEqual("3387616");
    expect(
      recs.ecoFriendly.energyStarUniqueId === "2408549" ||
        recs.ecoFriendly.energyStarUniqueId === "2408599" ||
        recs.ecoFriendly.energyStarUniqueId === "2408542",
    ).toBeTruthy();
  });

  it("Handles a low ceiling", async () => {
    // TODO: Check this case ?
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric", "Natural Gas"],
      ventType: null,
      heaterSpaceRestrictions: ["LOW_CEILINGS"],
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408797");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    // expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408797");
  });

  it("Handles a low ceiling and narrow width", async () => {
    // TODO: Check this case ?
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric", "Natural Gas"],
      ventType: null,
      heaterSpaceRestrictions: ["LOW_CEILINGS", "NARROW_WIDTH"],
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408797");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    // expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408797");
  });

  it("Handles all energy types", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric", "Natural Gas", "Propane"],
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408797");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408797");
  });

  it("Handles electricity only", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric"],
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408904");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    expect(
      recs.ecoFriendly.energyStarUniqueId === "2408585" ||
        recs.ecoFriendly.energyStarUniqueId === "2408591",
    ).toBeTruthy();
  });

  it("Handles natural gas only", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Natural Gas"],
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408797");
    expect(recs.ourRecommendation.energyStarUniqueId).toEqual("2408797");
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408797");
  });

  it("Handles propane only", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Propane"],
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
    expect(
      recs.bestValueChoice.energyStarUniqueId === "2408796" ||
        recs.bestValueChoice.energyStarUniqueId === "2408794" ||
        recs.bestValueChoice.energyStarUniqueId === "2408784",
    ).toBeTruthy();
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408796" ||
        recs.ourRecommendation.energyStarUniqueId === "2408794" ||
        recs.ourRecommendation.energyStarUniqueId === "2408784",
    ).toBeTruthy();
    expect(
      recs.ecoFriendly.energyStarUniqueId === "2408796" ||
        recs.ecoFriendly.energyStarUniqueId === "2408794" ||
        recs.ecoFriendly.energyStarUniqueId === "2408784",
    ).toBeTruthy();
  });

  it("Handles electric + solar", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric", "Solar Panels"],
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408904");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2407988");
  });

  it("Handles traditional vent", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric", "Natural Gas"],
      ventType: "Traditional Atmospheric Vent",
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408825");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408825");
  });

  it("Handles direct vent", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric", "Natural Gas"],
      ventType: "Direct Vent",
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2472807");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2472807");
  });

  it("Handles power vent", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric", "Natural Gas"],
      ventType: "Power Vent",
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408667");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408667");
  });

  it("Handles power direct vent", async () => {
    const userFormSubmission: ApplianceFinderType = {
      zipcode: "11215",
      householdSize: 3,
      supportedEnergyTypes: ["Electric", "Natural Gas"],
      ventType: "Power Direct Vent",
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
    expect(recs.bestValueChoice.energyStarUniqueId).toEqual("2408797");
    expect(
      recs.ourRecommendation.energyStarUniqueId === "2408585" ||
        recs.ourRecommendation.energyStarUniqueId === "2408591",
    ).toBeTruthy();
    expect(recs.ecoFriendly.energyStarUniqueId).toEqual("2408797");
  });
});

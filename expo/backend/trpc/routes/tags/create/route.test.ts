import { describe, it, expect, beforeEach } from "vitest";
import { createTestCaller } from "@/backend/__tests__/helpers/trpc-caller";
import { prisma as prismaMock } from "@/backend/__tests__/mocks/prisma";

describe("createTag", () => {
  let caller: Awaited<ReturnType<typeof createTestCaller>>;

  beforeEach(async () => {
    caller = await createTestCaller();
  });

  beforeEach(() => {
    prismaMock.tag.findUnique.mockResolvedValue(null);
  });

  it("deve criar uma tag com sucesso", async () => {
    const mockTag = {
      id: "tag-123",
      name: "Urgente",
      color: "#FF0000",
      userId: "user-123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.tag.create.mockResolvedValue(mockTag);

    const result = await caller.tags.create({
      name: "Urgente",
      color: "#FF0000",
    });

    expect(result.tag).toEqual(mockTag);
    expect(prismaMock.tag.create).toHaveBeenCalledWith({
      data: {
        name: "Urgente",
        color: "#FF0000",
        userId: "user-123",
      },
    });
  });

  it("deve falhar ao criar tag duplicada", async () => {
    prismaMock.tag.findUnique.mockResolvedValue({
      id: "tag-123",
      name: "Urgente",
      color: "#FF0000",
      userId: "user-123",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      caller.tags.create({
        name: "Urgente",
        color: "#FF0000",
      })
    ).rejects.toThrow("Você já possui uma tag com este nome");
  });

  it("deve validar formato da cor", async () => {
    await expect(
      caller.tags.create({
        name: "Urgente",
        color: "red",
      })
    ).rejects.toThrow();
  });
});

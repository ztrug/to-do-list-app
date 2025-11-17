import { describe, it, expect, beforeEach } from "vitest";
import { createTestCaller } from "@/backend/__tests__/helpers/trpc-caller";
import { prisma as prismaMock } from "@/backend/__tests__/mocks/prisma";

describe("listTags", () => {
  let caller: Awaited<ReturnType<typeof createTestCaller>>;

  beforeEach(async () => {
    caller = await createTestCaller();
  });

  it("deve listar tags do usuário com contagem de tarefas", async () => {
    const mockTags = [
      {
        id: "tag-1",
        name: "Urgente",
        color: "#FF0000",
        userId: "user-123",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        _count: { todos: 5 },
      },
      {
        id: "tag-2",
        name: "Pessoal",
        color: "#00FF00",
        userId: "user-123",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
        _count: { todos: 3 },
      },
    ];

    prismaMock.tag.findMany.mockResolvedValue(mockTags);

    const result = await caller.tags.list();

    expect(result.tags).toHaveLength(2);
    expect(result.tags[0]).toEqual({
      id: "tag-1",
      name: "Urgente",
      color: "#FF0000",
      todoCount: 5,
      createdAt: mockTags[0].createdAt,
    });
    expect(prismaMock.tag.findMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
      include: {
        _count: {
          select: {
            todos: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  });
});

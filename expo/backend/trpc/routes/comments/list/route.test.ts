import { describe, it, expect, beforeEach } from "vitest";
import { createTestCaller } from "@/backend/__tests__/helpers/trpc-caller";
import { prisma as prismaMock } from "@/backend/__tests__/mocks/prisma";

describe("listComments", () => {
  let caller: Awaited<ReturnType<typeof createTestCaller>>;

  beforeEach(async () => {
    caller = await createTestCaller();
  });

  it("deve listar comentários de uma tarefa", async () => {
    const mockTodo = {
      id: "todo-123",
      title: "Test Todo",
      completed: false,
      priority: "urgent",
      userId: "user-123",
      categoryId: null,
      dueDate: null,
      notificationId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockComments = [
      {
        id: "comment-1",
        content: "Primeiro comentário",
        todoId: "todo-123",
        userId: "user-123",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
        user: {
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
          profilePhoto: null,
        },
      },
      {
        id: "comment-2",
        content: "Segundo comentário",
        todoId: "todo-123",
        userId: "user-123",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        user: {
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
          profilePhoto: null,
        },
      },
    ];

    prismaMock.todo.findFirst.mockResolvedValue(mockTodo);
    prismaMock.comment.findMany.mockResolvedValue(mockComments);

    const result = await caller.comments.list({ todoId: "todo-123" });

    expect(result.comments).toHaveLength(2);
    expect(result.count).toBe(2);
    expect(prismaMock.comment.findMany).toHaveBeenCalledWith({
      where: { todoId: "todo-123" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { createTestCaller } from "@/backend/__tests__/helpers/trpc-caller";
import { prisma as prismaMock } from "@/backend/__tests__/mocks/prisma";

describe("createComment", () => {
  let caller: Awaited<ReturnType<typeof createTestCaller>>;

  beforeEach(async () => {
    caller = await createTestCaller();
  });

  it("deve criar comentário com sucesso", async () => {
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

    const mockComment = {
      id: "comment-123",
      content: "Ótimo progresso!",
      todoId: "todo-123",
      userId: "user-123",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      },
    };

    prismaMock.todo.findFirst.mockResolvedValue(mockTodo);
    prismaMock.comment.create.mockResolvedValue(mockComment);

    const result = await caller.comments.create({
      todoId: "todo-123",
      content: "Ótimo progresso!",
    });

    expect(result.comment).toEqual(mockComment);
    expect(prismaMock.comment.create).toHaveBeenCalledWith({
      data: {
        content: "Ótimo progresso!",
        todoId: "todo-123",
        userId: "user-123",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  });

  it("deve falhar ao comentar em tarefa que não existe", async () => {
    prismaMock.todo.findFirst.mockResolvedValue(null);

    await expect(
      caller.comments.create({
        todoId: "invalid-todo",
        content: "Comentário",
      })
    ).rejects.toThrow("Tarefa não encontrada");
  });
});

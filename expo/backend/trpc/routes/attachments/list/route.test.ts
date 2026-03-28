import { describe, it, expect, beforeEach } from "vitest";
import { createTestCaller } from "@/backend/__tests__/helpers/trpc-caller";
import { prisma as prismaMock } from "@/backend/__tests__/mocks/prisma";

describe("listAttachments", () => {
  let caller: Awaited<ReturnType<typeof createTestCaller>>;

  beforeEach(async () => {
    caller = await createTestCaller();
  });

  it("deve listar anexos de uma tarefa", async () => {
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

    const mockAttachments = [
      {
        id: "att-1",
        filename: "document.pdf",
        fileUrl: "https://example.com/document.pdf",
        fileType: "application/pdf",
        fileSize: 1024000,
        todoId: "todo-123",
        userId: "user-123",
        createdAt: new Date("2024-01-02"),
      },
      {
        id: "att-2",
        filename: "image.png",
        fileUrl: "https://example.com/image.png",
        fileType: "image/png",
        fileSize: 512000,
        todoId: "todo-123",
        userId: "user-123",
        createdAt: new Date("2024-01-01"),
      },
    ];

    prismaMock.todo.findFirst.mockResolvedValue(mockTodo);
    prismaMock.attachment.findMany.mockResolvedValue(mockAttachments);

    const result = await caller.attachments.list({ todoId: "todo-123" });

    expect(result.attachments).toHaveLength(2);
    expect(result.count).toBe(2);
    expect(result.totalSize).toBe(1536000);
  });

  it("deve falhar ao listar anexos de tarefa que não existe", async () => {
    prismaMock.todo.findFirst.mockResolvedValue(null);

    await expect(
      caller.attachments.list({ todoId: "invalid-todo" })
    ).rejects.toThrow("Tarefa não encontrada");
  });
});

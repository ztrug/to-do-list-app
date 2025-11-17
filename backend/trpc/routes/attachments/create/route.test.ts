import { expect, test, describe, beforeEach, vi } from "vitest";
import { createTestCaller } from "@/backend/__tests__/helpers/trpc-caller";
import { prisma } from "@/backend/__tests__/mocks/prisma";

describe("createAttachment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should create attachment successfully", async () => {
    const userId = "test-user-id";
    const todoId = "test-todo-id";
    const mockTodo = {
      id: todoId,
      title: "Test Todo",
      completed: false,
      priority: "intermediate",
      dueDate: null,
      notificationId: null,
      userId,
      categoryId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockAttachment = {
      id: "test-attachment-id",
      filename: "image.jpg",
      fileUrl: "https://example.com/image.jpg",
      fileType: "image/jpeg",
      fileSize: 1024,
      todoId,
      userId,
      createdAt: new Date(),
    };

    prisma.todo.findFirst.mockResolvedValue(mockTodo);
    prisma.attachment.create.mockResolvedValue(mockAttachment);

    const caller = await createTestCaller();
    vi.spyOn(caller as any, 'userId', 'get').mockReturnValue(userId);
    const result = await caller.attachments.create({
      todoId,
      filename: "image.jpg",
      fileUrl: "https://example.com/image.jpg",
      fileType: "image/jpeg",
      fileSize: 1024,
    });

    expect(result).toEqual(mockAttachment);
    expect(prisma.todo.findFirst).toHaveBeenCalled();
    expect(prisma.attachment.create).toHaveBeenCalledWith({
      data: {
        filename: "image.jpg",
        fileUrl: "https://example.com/image.jpg",
        fileType: "image/jpeg",
        fileSize: 1024,
        todoId,
        userId,
      },
    });
  });

  test("should throw error if todo not found", async () => {
    const userId = "test-user-id";
    const todoId = "non-existent-todo-id";

    prisma.todo.findFirst.mockResolvedValue(null);

    const caller = await createTestCaller();
    vi.spyOn(caller as any, 'userId', 'get').mockReturnValue(userId);

    await expect(
      caller.attachments.create({
        todoId,
        filename: "image.jpg",
        fileUrl: "https://example.com/image.jpg",
        fileType: "image/jpeg",
        fileSize: 1024,
      })
    ).rejects.toThrow("Tarefa não encontrada");
  });
});

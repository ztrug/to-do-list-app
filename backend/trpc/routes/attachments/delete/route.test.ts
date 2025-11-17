import { expect, test, describe, beforeEach, vi } from "vitest";
import { createTestCaller } from "@/backend/__tests__/helpers/trpc-caller";
import { prisma } from "@/backend/__tests__/mocks/prisma";

describe("deleteAttachment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should delete attachment successfully", async () => {
    const userId = "test-user-id";
    const attachmentId = "test-attachment-id";
    const mockAttachment = {
      id: attachmentId,
      filename: "image.jpg",
      fileUrl: "https://example.com/image.jpg",
      fileType: "image/jpeg",
      fileSize: 1024,
      todoId: "test-todo-id",
      userId,
      createdAt: new Date(),
    };

    prisma.attachment.findFirst.mockResolvedValue(mockAttachment);
    prisma.attachment.delete.mockResolvedValue(mockAttachment);

    const caller = await createTestCaller();
    vi.spyOn(caller as any, 'userId', 'get').mockReturnValue(userId);
    const result = await caller.attachments.delete({
      attachmentId,
    });

    expect(result).toEqual({ success: true });
    expect(prisma.attachment.findFirst).toHaveBeenCalled();
    expect(prisma.attachment.delete).toHaveBeenCalledWith({
      where: {
        id: attachmentId,
      },
    });
  });

  test("should throw error if attachment not found", async () => {
    const userId = "test-user-id";
    const attachmentId = "non-existent-attachment-id";

    prisma.attachment.findFirst.mockResolvedValue(null);

    const caller = await createTestCaller();
    vi.spyOn(caller as any, 'userId', 'get').mockReturnValue(userId);

    await expect(
      caller.attachments.delete({
        attachmentId,
      })
    ).rejects.toThrow("Anexo não encontrado");
  });
});

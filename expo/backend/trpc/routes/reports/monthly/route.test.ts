import { describe, it, expect, beforeEach } from "vitest";
import { createTestCaller } from "@/backend/__tests__/helpers/trpc-caller";
import { prisma as prismaMock } from "@/backend/__tests__/mocks/prisma";

describe("monthlyReport", () => {
  let caller: Awaited<ReturnType<typeof createTestCaller>>;

  beforeEach(async () => {
    caller = await createTestCaller();
  });

  it("deve gerar relatório mensal com sucesso", async () => {
    const mockTodos = [
      {
        id: "todo-1",
        title: "Tarefa 1",
        completed: false,
        priority: "urgent",
        userId: "user-123",
        categoryId: "cat-1",
        dueDate: null,
        notificationId: null,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        category: { id: "cat-1", name: "Trabalho", color: "#FF0000", icon: null, createdAt: new Date(), updatedAt: new Date() },
      },
      {
        id: "todo-2",
        title: "Tarefa 2",
        completed: false,
        priority: "intermediate",
        userId: "user-123",
        categoryId: null,
        dueDate: null,
        notificationId: null,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
        category: null,
      },
    ];

    const mockCompletedTodos = [
      {
        id: "todo-1",
        title: "Tarefa 1",
        completed: true,
        priority: "urgent",
        userId: "user-123",
        categoryId: "cat-1",
        dueDate: null,
        notificationId: null,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-16"),
      },
    ];

    prismaMock.todo.findMany.mockResolvedValueOnce(mockTodos).mockResolvedValueOnce(mockCompletedTodos);

    const result = await caller.reports.monthly({ year: 2024, month: 1 });

    expect(result.report.summary.totalCreated).toBe(2);
    expect(result.report.summary.totalCompleted).toBe(1);
    expect(result.report.summary.completionRate).toBe(50);
    expect(result.report.byPriority.urgent).toBe(1);
    expect(result.report.byPriority.intermediate).toBe(1);
    expect(result.report.byCategory["Trabalho"]).toBe(1);
    expect(result.report.byCategory["Sem categoria"]).toBe(1);
  });

  it("deve validar mês e ano", async () => {
    await expect(caller.reports.monthly({ year: 2024, month: 13 })).rejects.toThrow();
    await expect(caller.reports.monthly({ year: 2024, month: 0 })).rejects.toThrow();
  });
});

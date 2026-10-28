const { test, expect } = require("@playwright/test");

test.describe("TaskFlow — parcours utilisateur", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("http://127.0.0.1:4173");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByRole("heading", { name: "Nouvelle tâche" })).toBeVisible();
  });

  test("ajout, modification, achèvement, filtres, recherche et suppression", async ({ page }) => {
    await page.getByLabel("Titre *").fill("Préparer le CV");
    await page.getByLabel("Description").fill("Ajouter les projets GitHub");
    await page.getByLabel("Priorité").selectOption("Haute");
    await page.getByRole("button", { name: "Ajouter la tâche" }).click();

    const task = page.locator("article.task").filter({ has: page.getByRole("heading", { name: "Préparer le CV" }) });
    await expect(task).toBeVisible();
    await expect(task.getByText("Ajouter les projets GitHub")).toBeVisible();
    await expect(task.getByText("Priorité Haute")).toBeVisible();
    await expect(page.locator(".stat").nth(0).locator("strong")).toHaveText("1");
    await expect(page.getByText("Tâche ajoutée.")).toBeVisible();

    await task.getByRole("button", { name: "Modifier" }).click();
    await expect(page.getByRole("heading", { name: "Modifier la tâche" })).toBeVisible();
    await page.getByLabel("Titre *").fill("CV finalisé");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByRole("heading", { name: "CV finalisé" })).toBeVisible();

    const updatedTask = page.locator("article.task").filter({ has: page.getByRole("heading", { name: "CV finalisé" }) });
    await updatedTask.getByRole("checkbox").check();
    await expect(page.locator(".stat").nth(1).locator("strong")).toHaveText("0");
    await expect(page.locator(".stat").nth(2).locator("strong")).toHaveText("1");

    await page.getByRole("button", { name: "À faire", exact: true }).click();
    await expect(page.getByText("Aucune tâche ne correspond à ces filtres.")).toBeVisible();
    await page.getByRole("button", { name: "Terminées", exact: true }).click();
    await expect(page.getByRole("heading", { name: "CV finalisé" })).toBeVisible();

    await page.getByLabel("Rechercher une tâche").fill("introuvable");
    await expect(page.getByText("Aucune tâche ne correspond à ces filtres.")).toBeVisible();
    await page.getByRole("searchbox").fill("finalisé");
    await expect(page.getByRole("heading", { name: "CV finalisé" })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "CV finalisé" })).toBeVisible();
    await page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", { name: "Supprimer" }).click();
    await expect(page.getByText("Aucune tâche pour le moment.")).toBeVisible();
  });

  test("annulation de modification et effacement des tâches terminées", async ({ page }) => {
    await page.getByLabel("Titre *").fill("Lire documentation");
    await page.getByRole("button", { name: "Ajouter la tâche" }).click();
    const task = page.locator("article.task").filter({ has: page.getByRole("heading", { name: "Lire documentation" }) });
    await task.getByRole("button", { name: "Modifier" }).click();
    await page.getByLabel("Titre *").fill("Changement non sauvegardé");
    await page.getByRole("button", { name: "Annuler" }).click();
    await expect(page.getByRole("heading", { name: "Lire documentation" })).toBeVisible();

    await task.getByRole("checkbox").check();
    await page.once("dialog", dialog => dialog.accept());
    await page.getByRole("button", { name: "Effacer les tâches terminées" }).click();
    await expect(page.getByText("Aucune tâche pour le moment.")).toBeVisible();
  });

  test("interface utilisable sur un écran mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByRole("heading", { name: "Faites de la place à l’essentiel." })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  });
});

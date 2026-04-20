import { test, expect } from '@playwright/test';

test.describe('Eventra Happy Path', () => {
  test('landing page loads and AI assistant is accessible', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check if the landing page core heading is present
    await expect(page.locator('h1')).toContainText(/Smarter Events/i);

    // Verify "ASK EVENTRA AI" button is visible
    const assistantBtn = page.getByRole('button', { name: /ASK EVENTRA AI/i });
    await expect(assistantBtn).toBeVisible();

    // Open AI Assistant
    await assistantBtn.click();

    // Check if assistant window opens
    await expect(page.getByText('EVENTRA AI', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder(/Query the system/i)).toBeVisible();

    // Verify Chat functionality (MOCKED via fetch intercept)
    await page.route('**/api/ai/chat', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ text: 'E2E Test: I am operational.' }),
      });
    });

    const input = page.getByPlaceholder(/Query the system/i);
    await input.fill('Status check');
    await input.press('Enter');

    await expect(page.getByText('E2E Test: I am operational.')).toBeVisible();
  });
});

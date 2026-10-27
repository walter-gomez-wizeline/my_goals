import { expect, test } from '@playwright/test';
test('production foundation loads honestly without cloud credentials', async ({page}) => {
  const response=await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading',{name:'Development foundation'})).toBeVisible();
  await expect(page.getByText('Journal, account access and cloud services are not implemented yet.')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

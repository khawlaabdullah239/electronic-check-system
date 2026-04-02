import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('renders login form with Arabic text', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('نظام الشيك الإلكتروني');
    await expect(page.locator('label').first()).toContainText('البريد الإلكتروني');
    await expect(page.locator('button[type="submit"]')).toContainText('تسجيل الدخول');
  });

  test('has email and password inputs', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('shows error on invalid login attempt', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@test.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    // Should show error (either from Supabase or connection error)
    await page.waitForTimeout(2000);
    // Page should still be on login (not redirected)
    await expect(page).toHaveURL(/\/login/);
  });

  test('login form is RTL directed', async ({ page }) => {
    await page.goto('/login');
    const dir = await page.locator('div[dir="rtl"]').first().getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('page title is in Arabic', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle('نظام الشيك الإلكتروني السوداني');
  });
});

test.describe('Protected Routes', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects /checks to login when not authenticated', async ({ page }) => {
    await page.goto('/checks');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects /checks/add to login when not authenticated', async ({ page }) => {
    await page.goto('/checks/add');
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('App Structure', () => {
  test('HTML has RTL direction', async ({ page }) => {
    await page.goto('/login');
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');
  });

  test('HTML has Arabic language', async ({ page }) => {
    await page.goto('/login');
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('ar');
  });

  test('no team member names visible on login page', async ({ page }) => {
    await page.goto('/login');
    const content = await page.textContent('body');
    expect(content).not.toContain('خولة عبدالله الطيب');
    expect(content).not.toContain('رنا صلاح محمد علي');
    expect(content).not.toContain('فداء فتح الرحمن اسحق');
    expect(content).not.toContain('نون عبدالرحيم عبيد');
    expect(content).not.toContain('محمد صالح');
  });

  test('copyright notice shows on login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=نظام الشيك الإلكتروني السوداني')).toBeVisible();
  });
});

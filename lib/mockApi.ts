import { getAccount } from "@/lib/storage";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestOtp(phoneNumber: string) {
  await delay(700);

  if (!/^09\d{9}$/.test(phoneNumber)) {
    throw new Error("شماره موبایل معتبر نیست.");
  }

  return { success: true };
}

export async function verifyOtp(code: string) {
  await delay(600);

  if (code !== "1234") {
    throw new Error("کد وارد شده صحیح نیست. برای تست از 1234 استفاده کن.");
  }

  return { success: true };
}

export async function createAccount(username: string, password: string) {
  await delay(500);

  if (getAccount()) {
    throw new Error("قبلاً یک حساب در این مرورگر ساخته شده است. وارد حساب شو.");
  }

  if (username.trim().length < 4) {
    throw new Error("نام کاربری باید حداقل ۴ کاراکتر باشد.");
  }

  if (password.length < 6) {
    throw new Error("رمز عبور باید حداقل ۶ کاراکتر باشد.");
  }

  return { success: true };
}

export async function login(username: string, password: string) {
  await delay(500);

  const account = getAccount();

  if (!account) {
    throw new Error("حسابی پیدا نشد. ابتدا ثبت‌نام کن.");
  }

  if (account.username !== username.trim() || account.password !== password) {
    throw new Error("نام کاربری یا رمز عبور صحیح نیست.");
  }

  return { success: true, username: account.username };
}

export async function submitStep(step: string) {
  await delay(500);
  return { success: true, step };
}

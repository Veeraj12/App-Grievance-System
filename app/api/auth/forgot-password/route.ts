import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success even if user not found (security: don't reveal user existence)
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generate a secure random token (hex string, 32 bytes → 64 char)
    const token = crypto.randomBytes(32).toString("hex");
    const expire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpire: expire,
      },
    });

    // In production, you'd send this via email (nodemailer/resend)
    // For now, log to terminal so you can test end-to-end
    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
    console.log("\n========================================");
    console.log("🔑 PASSWORD RESET LINK (DEV MODE)");
    console.log(`   User : ${user.email}`);
    console.log(`   Link : ${resetUrl}`);
    console.log(`   Expires in 1 hour`);
    console.log("========================================\n");

    // In dev, return the link so the UI can show it directly.
    // In production, remove resetUrl and send via email instead.
    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json({ success: true, ...(isDev ? { resetUrl } : {}) });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

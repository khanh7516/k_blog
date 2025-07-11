import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CredentialsForm } from "@/app/components/auth/CredentialsForm";
import { GithubSignInButton, GoogleSignInButton } from "@/app/components/auth/SignInButton";

export default async function SignInPage() {
  const session = await getServerSession(authConfig);
  if (session) return redirect("/");

  return (
    <div className="flex mt-35 items-center justify-center px-4 h-[500px]">
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-lg">
        <h1 className="mb-4 text-4xl font-bold">Sign In</h1>
        <GoogleSignInButton />
        <GithubSignInButton />
        <span className="text-2xl font-semibold text-white text-center mt-8">
          Or
        </span>
        <CredentialsForm />
        <p className="mt-6 text-sm text-center text-pink-500">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="underline hover:text-pink-600 transition-colors">
            Create one here
          </a>
        </p>
      </div>
    </div>
  );
}
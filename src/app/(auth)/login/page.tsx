import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Add await here!
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(
        "/login?message=Incorrect credentials. Archive remains locked.",
      );
    }

    return redirect("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-[#FFFDF9] border border-border p-8 md:p-12 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-10">
          <Lock className="w-8 h-8 text-primary mb-4" />
          <span className="font-serif text-3xl italic text-primary leading-none">
            JemJam
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-2">
            Private Archive
          </span>
        </div>

        <form action={signIn} className="flex flex-col gap-8">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-serif mb-2">
              Passcode
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-transparent border-b border-border/50 pb-2 font-serif text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {searchParams?.message && (
            <p className="text-red-600 text-xs text-center font-serif tracking-widest uppercase">
              {searchParams.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-background border border-primary text-primary hover:bg-primary hover:text-background transition-colors font-serif uppercase tracking-[0.2em] text-xs mt-4"
          >
            Unlock Archive
          </button>
        </form>
      </div>
    </div>
  );
}

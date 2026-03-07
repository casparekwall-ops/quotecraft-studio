import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase auth
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 500);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-foreground p-12 lg:flex">
        <Link to="/" className="text-xl font-bold text-primary-foreground">
          QuoteCraft
        </Link>
        <div>
          <p className="mb-2 text-3xl font-bold text-primary-foreground leading-tight">
            Start winning more jobs
            <br />with less admin.
          </p>
          <p className="text-primary-foreground/60">
            Create your free account and send your first quote in minutes.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/40">
          © {new Date().getFullYear()} QuoteCraft
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 block text-xl font-bold text-foreground lg:hidden">
            QuoteCraft
          </Link>
          <h1 className="mb-1 text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mb-8 text-muted-foreground">Get started with QuoteCraft for free.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" placeholder="John Smith" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" placeholder="Min. 8 characters" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="ml-1 h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

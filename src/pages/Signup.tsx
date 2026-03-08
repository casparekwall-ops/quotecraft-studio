import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error(t.auth.passwordMinLength);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t.auth.accountCreated);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between p-12 lg:flex relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 right-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">QuoteCraft</span>
          </div>
        </div>
        <div className="relative z-10">
          <p className="mb-2 text-3xl font-bold text-primary-foreground leading-tight whitespace-pre-line">
            {t.auth.signupHeroTitle}
          </p>
          <p className="text-primary-foreground/70">{t.auth.signupHeroDesc}</p>
        </div>
        <p className="relative z-10 text-sm text-primary-foreground/50">© {new Date().getFullYear()} QuoteCraft</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="gradient-primary flex h-7 w-7 items-center justify-center rounded-lg">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuoteCraft</span>
          </Link>
          <h1 className="mb-1 text-2xl font-bold text-foreground">{t.auth.createAccount}</h1>
          <p className="mb-8 text-muted-foreground">{t.auth.createAccountDesc}</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.auth.fullName}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" placeholder="John Smith" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" placeholder="Min. 8 characters" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? t.auth.creatingAccount : t.auth.createAccountBtn}
              {!loading && <ArrowRight className="ml-1 h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t.auth.hasAccount}{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">{t.auth.logIn}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

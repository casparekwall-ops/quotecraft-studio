import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 block text-xl font-bold text-foreground">QuoteCraft</Link>
        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-success/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">{t.auth.checkEmail}</h1>
            <p className="mb-6 text-muted-foreground">
              {t.auth.resetLinkSent} <span className="font-medium text-foreground">{email}</span>
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/login"><ArrowLeft className="mr-1 h-4 w-4" />{t.auth.backToLogin}</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-2xl font-bold text-foreground">{t.auth.resetPassword}</h1>
            <p className="mb-8 text-muted-foreground">{t.auth.resetDesc}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@company.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? t.auth.sending : t.auth.sendResetLink}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-medium text-primary hover:underline">
                <ArrowLeft className="mr-1 inline h-3 w-3" />{t.auth.backToLogin}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error(t.auth.passwordMinLength);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 inline-flex rounded-full bg-success/10 p-3">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">{t.auth.passwordUpdated}</h1>
          <p className="mb-6 text-muted-foreground">{t.auth.passwordUpdatedDesc}</p>
          <Button className="w-full" asChild>
            <Link to="/dashboard">{t.auth.goToDashboard}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold text-foreground">{t.auth.setNewPassword}</h1>
        <p className="mb-8 text-muted-foreground">{t.auth.newPasswordDesc}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.newPassword}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" placeholder="Min. 8 characters" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? t.auth.updating : t.auth.updatePassword}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

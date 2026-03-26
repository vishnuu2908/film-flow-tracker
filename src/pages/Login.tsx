import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Clapperboard, Eye, EyeOff, ShieldCheck, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Generate a random 6-digit OTP for demo purposes
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

const Login = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // OTP state
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCopied, setOtpCopied] = useState(false);

  // Fade-in animation state
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [step]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Only allow through if both authenticated AND OTP verified
  if (user && otpVerified) return <Navigate to="/" replace />;

  // Handle credential submission (login or signup)
  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Account created!", description: "Proceed with OTP verification." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      // Generate and show OTP
      const otp = generateOTP();
      setGeneratedOTP(otp);
      setStep("otp");
    } catch (error: any) {
      toast({
        title: isSignUp ? "Sign up failed" : "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP verification
  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOTP === generatedOTP) {
      setOtpVerified(true);
      toast({ title: "Verified!", description: "OTP verified successfully. Welcome!" });
    } else {
      toast({
        title: "Invalid OTP",
        description: "The code you entered doesn't match. Please try again.",
        variant: "destructive",
      });
      setEnteredOTP("");
    }
  };

  const copyOTP = () => {
    navigator.clipboard.writeText(generatedOTP);
    setOtpCopied(true);
    setTimeout(() => setOtpCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div
        className={`w-full max-w-md transition-all duration-500 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {step === "credentials" ? (
          /* ───── Step 1: Credentials ───── */
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Clapperboard className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">Short Film Tracker</CardTitle>
              <CardDescription>
                {isSignUp ? "Create your admin account" : "Sign in to manage your film projects"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCredentialSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@shortfilm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting
                    ? isSignUp ? "Creating account..." : "Signing in..."
                    : isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-primary hover:underline"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* ───── Step 2: OTP Verification ───── */
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold">OTP Verification</CardTitle>
              <CardDescription>Enter the 6-digit code to verify your identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Demo OTP display */}
              <div className="rounded-xl bg-muted/60 border border-border p-4 text-center space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Demo OTP (shown for testing)
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-mono font-bold tracking-[0.4em] text-primary">
                    {generatedOTP}
                  </span>
                  <button onClick={copyOTP} className="text-muted-foreground hover:text-foreground transition-colors">
                    {otpCopied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* OTP input */}
              <form onSubmit={handleOTPVerify} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={enteredOTP} onChange={setEnteredOTP}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={enteredOTP.length !== 6}>
                  Verify &amp; Continue
                </Button>
              </form>

              <button
                type="button"
                onClick={() => { setStep("credentials"); setEnteredOTP(""); setGeneratedOTP(""); }}
                className="w-full text-sm text-muted-foreground hover:text-foreground text-center"
              >
                ← Back to login
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;

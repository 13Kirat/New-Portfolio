import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearAllUserErrors } from "@/store/slices/userSlice";
import { forgotPassword } from "@/store/slices/forgotResetPasswordSlice";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
    if (message !== null) {
      toast.success(message);
    }
  }, [dispatch, isAuthenticated, error, loading]);

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2">
      <div className="min-h-[100vh] flex items-center justify-center py-12 px-5">
        <form onSubmit={handleForgotPassword} className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="font-mono text-3xl font-bold">
              <span className="text-gradient">Forgot</span> Password
            </h1>
            <p className="text-balance text-muted-foreground font-mono text-sm">
              // enter your email to request a reset link
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Link
                to="/login"
                className="ml-auto inline-block text-sm text-primary underline"
              >
                Remember your password?
              </Link>
            </div>
            {loading ? (
              <SpecialLoadingButton content={"Requesting"} />
            ) : (
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            )}
          </div>
        </form>
      </div>
      <div className="hidden lg:flex justify-center items-center bg-card/30 border-l border-border p-10">
        <div className="terminal-window w-full max-w-sm">
          <div className="terminal-window-bar">
            <span className="terminal-window-dot bg-[#ff5f56]" />
            <span className="terminal-window-dot bg-[#ffbd2e]" />
            <span className="terminal-window-dot bg-[#27c93f]" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">recovery.sh</span>
          </div>
          <div className="p-5 font-mono text-sm text-muted-foreground space-y-2">
            <p>$ password-reset --request</p>
            <p className="text-primary">Checking account...</p>
            <p>$ mail --send reset-link</p>
            <p className="text-gradient">Check your inbox.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

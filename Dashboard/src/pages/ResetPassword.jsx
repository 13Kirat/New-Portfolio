import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  resetPassword,
  clearAllForgotResetPassErrors,
} from "@/store/slices/forgotResetPasswordSlice";
import { getUser } from "@/store/slices/userSlice";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import { toast } from "react-toastify";
import PasswordInput from "@/components/PasswordInput";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
    dispatch(resetPassword(token, password, confirmPassword));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllForgotResetPassErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
    if (message !== null) {
      toast.success(message);
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2">
      <div className="min-h-[100vh] flex items-center justify-center py-12 px-5">
        <form onSubmit={handleResetPassword} className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="font-mono text-3xl font-bold">
              <span className="text-gradient">Reset</span> Password
            </h1>
            <p className="text-balance text-muted-foreground font-mono text-sm">
              // set a new password for your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Password</Label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {loading ? (
              <SpecialLoadingButton content={"Resetting Your Password"} />
            ) : (
              <Button type="submit" className="w-full">
                Reset Password
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
            <span className="ml-2 font-mono text-xs text-muted-foreground">reset.sh</span>
          </div>
          <div className="p-5 font-mono text-sm text-muted-foreground space-y-2">
            <p>$ password-reset --confirm</p>
            <p className="text-primary">Token valid.</p>
            <p>$ set-new-password</p>
            <p className="text-gradient">Almost done.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

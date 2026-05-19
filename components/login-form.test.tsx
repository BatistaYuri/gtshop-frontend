import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/login-form";

const mockReplace = vi.fn();
const mockLogin = vi.fn();
const mockClearError = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticating: false,
    error: null,
    clearError: mockClearError,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockLogin.mockReset();
    mockClearError.mockReset();
  });

  it("keeps the submit button enabled on first render", () => {
    render(<LoginForm />);

    expect(screen.getByRole("button", { name: "Acessar painel" })).toBeEnabled();
  });

  it("shows validation feedback and does not submit empty credentials", () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Acessar painel" }));

    expect(screen.getByText("Informe username e password para entrar.")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockClearError).toHaveBeenCalledTimes(1);
  });
});
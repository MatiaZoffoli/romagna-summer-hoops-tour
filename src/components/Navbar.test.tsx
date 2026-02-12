import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Navbar", () => {
  it("renders logo and tour name", () => {
    render(<Navbar />);
    expect(screen.getByText("ROMAGNA SUMMER")).toBeInTheDocument();
    expect(screen.getByText("HOOPS TOUR")).toBeInTheDocument();
  });

  it("renders main nav links", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /il tour/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tappe/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /classifica/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contatti/i })).toBeInTheDocument();
  });

  it("renders login link", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /accedi/i })).toBeInTheDocument();
  });

  it("toggles mobile menu when button is clicked", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /toggle menu/i });
    expect(screen.queryByText("Accedi / Registrati")).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByText("Accedi / Registrati")).toBeInTheDocument();
  });
});

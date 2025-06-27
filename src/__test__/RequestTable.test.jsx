import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import RequestTable from "../components/admin/RequestTable";
import { vi } from "vitest";

// ✅ Mock useAxios
vi.mock("@/hooks/useAxios/useAxios", () => {
  return {
    default: () => ({
      fetchData: vi.fn().mockResolvedValue([
        {
          id: "1",
          date: "2024-06-01T12:00:00Z",
          outletDTO: { name: "Outlet 1" },
          productDTO: { name: "Product 1" },
          quantity: 5,
          reason: "Restock needed",
          status: "PENDING",
          warehouseId: "w1",
        },
      ]),
    }),
  };
});

// ✅ Partial mock of SnackbarContexts to preserve SnackbarProvider
vi.mock("@/contexts/SnackbarContexts", async () => {
  const actual = await vi.importActual("@/contexts/SnackbarContexts");
  return {
    ...actual,
    useSnackbar: () => vi.fn(), // dummy snackbar function
  };
});

import { SnackbarProvider } from "@/contexts/SnackbarContexts";

describe("RequestTable Component", () => {
  it("renders with request data", async () => {
    render(
      <RecoilRoot>
        <SnackbarProvider>
          <RequestTable tabKey="restocking" warehouseId="w1" />
        </SnackbarProvider>
      </RecoilRoot>
    );

    expect(await screen.findByText("Outlet 1")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Restock needed")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
  });

  it("opens approve modal", async () => {
    render(
      <RecoilRoot>
        <SnackbarProvider>
          <RequestTable tabKey="restocking" warehouseId="w1" />
        </SnackbarProvider>
      </RecoilRoot>
    );

    const approveButton = await screen.findByText("Approve");
    fireEvent.click(approveButton);

    expect(await screen.findByText("Are you sure to approve the request?")).toBeInTheDocument();
  });

  it("opens reject modal and enters reason", async () => {
    render(
      <RecoilRoot>
        <SnackbarProvider>
          <RequestTable tabKey="restocking" warehouseId="w1" />
        </SnackbarProvider>
      </RecoilRoot>
    );

    const rejectButton = await screen.findByText("Reject");
    fireEvent.click(rejectButton);

    const textarea = await screen.findByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Out of stock" } });

    expect(textarea.value).toBe("Out of stock");
  });
});

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import OutletTable from "@/components/admin/OutletTable";
import { RecoilRoot } from "recoil";
import { outletList } from "@/atoms/sampleAtom";
import { vi } from "vitest";


window.getComputedStyle = vi.fn().mockImplementation(() => ({
  getPropertyValue: () => "",
}));


const mockFetchData = vi.fn();
vi.mock("@/hooks/useAxios/useAxios", () => ({
  default: () => ({ fetchData: mockFetchData }),
}));

const mockOutlets = [
  {
    id: 1,
    address: "123 Main St",
    name: "Outlet One",
    warehouseId: 10,
    active: true,
  },
  {
    id: 2,
    address: "456 Elm St",
    name: "Second Outlet",
    warehouseId: 20,
    active: false,
  },
];

const setup = (props = {}, outletAtomState = []) => {
  return render(
    <RecoilRoot
      initializeState={({ set }) => set(outletList, outletAtomState)}
    >
      <OutletTable
        warehouseId={props.warehouseId || ""}
        outletName={props.outletName || ""}
        onEdit={props.onEdit || vi.fn()}
      />
    </RecoilRoot>
  );
};

describe("OutletTable Component", () => {
  beforeEach(() => {
    mockFetchData.mockReset();
    localStorage.setItem("adminToken", "test-token");
  });

  test("fetches data when outletList is empty", async () => {
    mockFetchData.mockResolvedValue(mockOutlets);

    setup();

    await waitFor(() => {
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "/admin/outlet",
          method: "GET",
        })
      );
    });

    expect(await screen.findByText("Outlet One")).toBeInTheDocument();
  });

  test("does not fetch data when outletList has values", async () => {
    setup({}, mockOutlets);

    await waitFor(() =>
      expect(screen.getByText("Outlet One")).toBeInTheDocument()
    );

    expect(mockFetchData).not.toHaveBeenCalled();
  });

  test("filters data by warehouseId", async () => {
    setup({ warehouseId: "10" }, mockOutlets);

    expect(await screen.findByText("Outlet One")).toBeInTheDocument();
    expect(screen.queryByText("Second Outlet")).not.toBeInTheDocument();
  });

  test("filters data by outletName", async () => {
    setup({ outletName: "second" }, mockOutlets);

    expect(await screen.findByText("Second Outlet")).toBeInTheDocument();
    expect(screen.queryByText("Outlet One")).not.toBeInTheDocument();
  });

  test("calls onEdit with correct record", async () => {
    const mockOnEdit = vi.fn();
    setup({ onEdit: mockOnEdit }, mockOutlets);

    const editButton = await screen.findAllByRole("button");
    fireEvent.click(editButton[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockOutlets[0]);
  });

  test("shows correct status tag", async () => {
    setup({}, mockOutlets);

    expect(await screen.findByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });
});

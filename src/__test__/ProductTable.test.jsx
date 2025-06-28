import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import ProductTable from "@/components/admin/ProductTable";
import { productList } from "@/atoms/sampleAtom";
import { vi } from "vitest";
import useAxios from "@/hooks/useAxios/useAxios";




const mockFetchData = vi.fn();
vi.mock("@/hooks/useAxios/useAxios", () => ({
  default: () => ({ fetchData: mockFetchData })
}));

// Mock barcode to prevent rendering issues in test
vi.mock("react-barcode", () => ({ default: () => <div>Barcode</div> }));

describe("ProductTable Component", () => {
  const mockSetData = vi.fn();
  const mockOnEdit = vi.fn();

  const mockProducts = [
    {
      id: "123",
      currency: "INR",
      name: "Test Product",
      price: 100,
      supplierId: "1",
      category: "Grocery",
      threshold: 10,
      wholesale_price: 90,
    },
    {
      id: "456",
      currency: "INR",
      name: "Another Product",
      price: 200,
      supplierId: "2",
      category: "Dairy",
      threshold: 5,
      wholesale_price: 180,
    }
  ];

  beforeEach(() => {
    mockFetchData.mockReset();
    mockOnEdit.mockReset();
    localStorage.setItem("adminToken", "dummy-token");
  });

  const setup = (list = [], supplierId = "", productName = "") => {
    return render(
      <RecoilRoot initializeState={({ set }) => set(productList, list)}>
        <ProductTable
          supplierId={supplierId}
          productName={productName}
          onEdit={mockOnEdit}
        />
      </RecoilRoot>
    );
  };

  test("fetches data if productList is empty", async () => {
    mockFetchData.mockResolvedValue(mockProducts);

    setup([]);

    await waitFor(() => expect(mockFetchData).toHaveBeenCalled());
  });

  test("does not fetch if productList already populated", async () => {
    setup(mockProducts);

    await waitFor(() => expect(mockFetchData).not.toHaveBeenCalled());
  });

  test("filters by supplierId", async () => {
    setup(mockProducts, "1");

    await screen.findByText("Test Product");
    expect(screen.queryByText("Another Product")).not.toBeInTheDocument();
  });

  test("filters by productName", async () => {
    setup(mockProducts, "", "another");

    await screen.findByText("Another Product");
    expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
  });

  test("calls onEdit with correct product", async () => {
    setup(mockProducts);

    const editButtons = await screen.findAllByRole("button");
    fireEvent.click(editButtons[1]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[1]);
  });
});

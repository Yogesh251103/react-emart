import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DropDown from "@/components/admin/DropDown";
import { vi } from "vitest";


const mockFetchData = vi.fn();
vi.mock("@/hooks/useAxios/useAxios", () => ({
  default: () => ({ fetchData: mockFetchData }),
}));

describe("DropDown Component", () => {
  const mockSetter = vi.fn();
  const mockSetGlobalState = vi.fn();

  const mockData = [
    { id: "1", name: "Option A", active: true },
    { id: "2", name: "Option B", active: false },
    { id: "3", name: "Option C", active: true },
  ];

  beforeEach(() => {
    mockFetchData.mockReset();
    mockSetter.mockReset();
    mockSetGlobalState.mockReset();
    localStorage.setItem("adminToken", "test-token");
  });

  test("renders label and Select", async () => {
    mockFetchData.mockResolvedValue(mockData);

    render(
      <DropDown
        url="/api/categories"
        method="GET"
        setter={mockSetter}
        globalState={[]}
        setGlobalState={mockSetGlobalState}
        selectedValue=""
      />
    );

    expect(screen.getByText("Select categories")).toBeInTheDocument();
    await waitFor(() => expect(mockFetchData).toHaveBeenCalled());
  });

  test("uses globalState if provided", async () => {
    render(
      <DropDown
        url="/api/categories"
        method="GET"
        setter={mockSetter}
        globalState={mockData}
        setGlobalState={mockSetGlobalState}
        selectedValue=""
      />
    );

    await waitFor(() => {
      expect(mockFetchData).not.toHaveBeenCalled();
      expect(mockSetGlobalState).not.toHaveBeenCalled();
    });
  });

  test("calls setter on change", async () => {
    render(
      <DropDown
        url="/api/categories"
        method="GET"
        setter={mockSetter}
        globalState={mockData}
        setGlobalState={mockSetGlobalState}
        selectedValue=""
      />
    );

    const select = await screen.findByRole("combobox");
    fireEvent.mouseDown(select); // open dropdown

    const options = await screen.findAllByText("Option A");
    fireEvent.click(options[1]); // Click the dropdown item

    expect(mockSetter).toHaveBeenCalledWith("1");
  });

  test("respects selectedValue when provided", async () => {
    render(
      <DropDown
        url="/api/categories"
        method="GET"
        setter={mockSetter}
        globalState={mockData}
        setGlobalState={mockSetGlobalState}
        selectedValue="3"
      />
    );

    expect(await screen.findByText("Option C")).toBeInTheDocument();
  });
});


vi.mock("@/hooks/useAxios/useAxios", () => ({
  default: vi.fn(() => ({
    fetchData: vi.fn(() => Promise.resolve(mockUserData)),
    loading: false,
  })),
}));

vi.mock("@/contexts/SnackbarContexts", () => ({
  useSnackbar: () => vi.fn(),
}));

beforeAll(() => {
  window.getComputedStyle = () => ({
    getPropertyValue: () => "",
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import UserProfile from "@/components/UserProfile";
import useAxios from "@/hooks/useAxios/useAxios";

const mockUserData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  username: "johndoe",
  image: "",
};

describe("UserProfile Component", () => {
  const mockSetUser = vi.fn();

  test("renders title", () => {
    render(
      <UserProfile
        title="My Profile"
        user={{ loaded: true, data: mockUserData }}
        setUser={mockSetUser}
        token="mockToken"
      />
    );

    expect(screen.getByText("My Profile")).toBeInTheDocument();
  });

  test("shows loader when loading is true", () => {
     useAxios.mockReturnValueOnce({
      fetchData: vi.fn(),
      loading: true,
    });

    render(
      <UserProfile
        title="Loading Profile"
        user={{ loaded: false, data: {} }}
        setUser={mockSetUser}
        token="mockToken"
      />
    );

     expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    
  });

  test("displays user info after fetch", async () => {
    render(
      <UserProfile
        title="User Info"
        user={{ loaded: true, data: mockUserData }}
        setUser={mockSetUser}
        token="mockToken"
      />
    );

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("johndoe")).toBeInTheDocument();
  });

  test("opens edit profile modal on button click", async () => {
    render(
      <UserProfile
        title="Test"
        user={{ loaded: true, data: mockUserData }}
        setUser={mockSetUser}
        token="mockToken"
      />
    );

    const editBtn = screen.getByRole("button", { name: /edit profile/i });
    fireEvent.click(editBtn);

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByText("Edit Profile")).toBeInTheDocument();
    });
  });
});

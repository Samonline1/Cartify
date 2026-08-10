import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../AuthContext";
import { useAdminDashboard } from "../hooks/queries/useAdminDashboard";
import { useAdminUsers } from "../hooks/queries/useAdminUsers";
import { useAdminUser } from "../hooks/queries/useAdminUser";
import { useAdminLogout } from "../hooks/queries/useAdminLogout";
import { useAdminProducts } from "../hooks/queries/useAdminProducts";
import { useDeleteAdminUser } from "../hooks/queries/useDeleteAdminUser";

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();
  const [activeView, setActiveView] = useState("overview");
  const [userQuery, setUserQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productResults, setProductResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser || storedUser.role !== "admin") {
      navigate("/admin");
    }
  }, [navigate, user]);

  const dashboardQuery = useAdminDashboard();

  const usersQuery = useAdminUsers();

  const selectedUserQuery = useAdminUser(selectedUserId);

  const logoutMutation = useAdminLogout();

  const productSearchMutation = useAdminProducts();

  const deleteUserMutation = useDeleteAdminUser();

  useEffect(() => {
    if (dashboardQuery.isError || usersQuery.isError) {
      const err = dashboardQuery.error || usersQuery.error;
      toast.error(err.response?.data?.msg || "Failed to load admin dashboard");
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/admin");
      }
    }
  }, [dashboardQuery.error, dashboardQuery.isError, navigate, usersQuery.error, usersQuery.isError]);

  const stats = dashboardQuery.data?.stats || {};
  const users = useMemo(() => usersQuery.data?.users ?? [], [usersQuery.data]);
  const products = productResults;
  const selectedUser = selectedUserQuery.data?.user || null;
  const selectedUserCartCount = (selectedUser?.cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  const selectedUserSpent = (selectedUser?.purchased || []).reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const filteredUsers = useMemo(() => {
    const search = userQuery.trim().toLowerCase();
    if (!search) return users;
    return users.filter((item) =>
      `${item.name || ""} ${item.email || ""} ${item.role || ""}`.toLowerCase().includes(search)
    );
  }, [userQuery, users]);

  const handleProductSearchSubmit = (e) => {
    e.preventDefault();
    productSearchMutation.mutate(productQuery.trim(), {
      onSuccess: (data) => {
        queryClient.setQueryData(["admin", "products", productQuery.trim()], data);
        setProductResults(data.products || []);
        setSelectedProduct(null);
      },
      onError: (err) => {
        toast.error(err.response?.data?.msg || "Failed to load products");
      },
    });
  };

  const navigateView = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const closeSidebar = () => setSidebarOpen(false);

  const loading = dashboardQuery.isLoading || usersQuery.isLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white p-3 lg:block">
          <div className="sticky top-4">
            <div className="rounded-r-3xl border border-gray-200 border-l-0 bg-white px-3 py-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600">Admin</p>
              <h1 className="mt-2 max-w-full overflow-hidden text-xl font-bold leading-none tracking-tight text-gray-900 xl:text-[1.35rem]">
                Dashboard
              </h1>
            </div>
            <div className="mt-6 space-y-2">
              {["overview", "users", "products"].map((view) => (
                <button
                  key={view}
                  onClick={() => navigateView(view)}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                    activeView === view
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {view[0].toUpperCase() + view.slice(1)}
                </button>
              ))}
              <button
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
              onClick={() => {
                closeSidebar();
                logoutMutation.mutate(undefined, {
                  onSuccess: () => {
                    setUser(null);
                    localStorage.removeItem("user");
                    queryClient.clear();
                    navigate("/admin");
                  },
                  onError: (err) => {
                    toast.error(err.response?.data?.msg || "Could not log out");
                  },
                });
              }}
            >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:hidden">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Admin</p>
              <h1 className="text-xl font-bold leading-tight">{activeView[0].toUpperCase() + activeView.slice(1)}</h1>
            </div>
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="rounded-md border border-gray-300 bg-white p-2 text-gray-700"
              aria-label="Toggle menu"
              aria-expanded={sidebarOpen}
              aria-controls="admin-mobile-drawer"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Close menu"
                onClick={closeSidebar}
              />
              <aside
                id="admin-mobile-drawer"
                className="absolute left-0 top-0 h-full w-72 max-w-[85vw] border-r border-gray-200 bg-white p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Menu</p>
                    <p className="text-lg font-bold">Admin</p>
                  </div>
                  <button
                    onClick={closeSidebar}
                    className="rounded-md border border-gray-300 bg-white p-2 text-gray-700"
                    aria-label="Close menu"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {["overview", "users", "products"].map((view) => (
                    <button
                      key={view}
                      onClick={() => navigateView(view)}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                        activeView === view
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-300 bg-white text-gray-700"
                      }`}
                    >
                      {view[0].toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                  <button
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-700"
                    onClick={() => {
                      closeSidebar();
                      logoutMutation.mutate(undefined, {
                        onSuccess: () => {
                          setUser(null);
                          localStorage.removeItem("user");
                          queryClient.clear();
                          navigate("/admin");
                        },
                        onError: (err) => {
                          toast.error(err.response?.data?.msg || "Could not log out");
                        },
                      });
                    }}
                  >
                    Logout
                  </button>
                </div>
              </aside>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {activeView === "overview" && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Overview</p>
                  <h2 className="mt-1 text-2xl font-bold leading-tight">Store snapshot</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-600">
                    A quick summary of users, catalog, and purchase activity.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 min-w-0">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="mt-2 truncate text-2xl font-bold">${Number(stats.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 min-w-0">
                    <p className="text-sm text-gray-600">Users</p>
                    <p className="mt-2 truncate text-2xl font-bold">{Number(stats.totalUsers || 0)}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 min-w-0">
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="mt-2 truncate text-2xl font-bold">{Number(stats.totalProducts || 0)}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 min-w-0">
                    <p className="text-sm text-gray-600">Orders</p>
                    <p className="mt-2 truncate text-2xl font-bold">{Number(stats.totalOrders || 0)}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-4 min-w-0">
                    <p className="text-sm font-semibold text-gray-700">More details</p>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <p className="break-words">Categories: {Number(stats.totalCategories || 0)}</p>
                      <p className="break-words">Cart items in system: {Number(stats.totalCartItems || 0)}</p>
                      <p className="break-words">Admin accounts: {Number(stats.totalAdmins || 0)}</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 min-w-0">
                    <p className="text-sm font-semibold text-gray-700">Logged in as</p>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <p className="break-words">{user?.name || "Admin"}</p>
                      <p className="break-all">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === "users" && (
              <div className="space-y-4">
                <input
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Search users"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 pr-3 font-semibold">Name</th>
                        <th className="py-2 pr-3 font-semibold">Email</th>
                        <th className="py-2 pr-3 font-semibold">Role</th>
                        <th className="py-2 pr-3 font-semibold">Cart</th>
                        <th className="py-2 pr-3 font-semibold">Purchased</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((item) => (
                        <tr
                          key={item._id}
                          className="cursor-pointer border-b border-gray-100"
                          onClick={() => setSelectedUserId(item._id)}
                        >
                          <td className="max-w-[180px] py-2 pr-3 break-words">{item.name || "Unnamed"}</td>
                          <td className="max-w-[220px] py-2 pr-3 break-all">{item.email}</td>
                          <td className="py-2 pr-3">{item.role}</td>
                          <td className="py-2 pr-3">{item.cartCount}</td>
                          <td className="py-2 pr-3">{item.purchasedCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeView === "products" && (
              <div className="space-y-4">
                <form onSubmit={handleProductSearchSubmit} className="space-y-3">
                  <input
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    placeholder="Type a product name and press Enter"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500">Search runs only after you press Enter.</p>
                </form>

                {productSearchMutation.isPending && <p className="text-sm text-gray-600">Searching...</p>}

                <div className="grid gap-3 sm:grid-cols-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-sm"
                    >
                      <img src={product.thumbnail} alt={product.title} className="h-36 w-full object-cover" />
                      <div className="p-3">
                        <p className="truncate font-semibold">{product.title}</p>
                        <p className="truncate text-sm text-gray-600">{product.category}</p>
                        <p className="mt-1 truncate text-sm font-medium">${product.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <button onClick={() => setSelectedProduct(null)} className="rounded-md border border-gray-300 bg-white px-3 py-1">
                Close
              </button>
            </div>
            <img src={selectedProduct.thumbnail} alt={selectedProduct.title} className="mt-4 h-48 w-full rounded-lg object-cover" />
            <div className="mt-4 space-y-2 text-sm">
              <p className="break-words">Title: {selectedProduct.title}</p>
              <p className="break-words">Category: {selectedProduct.category}</p>
              <p>Price: ${selectedProduct.price}</p>
              <p>Rating: {selectedProduct.rating}</p>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">User Details</h3>
                <p className="text-sm text-gray-600">View account details and manage the user.</p>
              </div>
              <button
                onClick={() => setSelectedUserId(null)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Name</p>
                <p className="mt-1 break-words font-semibold">{selectedUser.name || "Unnamed"}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Email</p>
                <p className="mt-1 font-semibold break-all">{selectedUser.email}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Cart Products</p>
                <p className="mt-1 font-semibold">{selectedUserCartCount}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="mt-1 font-semibold">${selectedUserSpent.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-700">Purchased items</p>
              <div className="mt-3 max-h-48 space-y-2 overflow-auto text-sm">
                {(selectedUser.purchased || []).length ? (
                  selectedUser.purchased.map((item, index) => (
                    <div key={`${item.product}-${index}`} className="rounded-md border border-gray-200 bg-white p-3">
                      <p className="font-medium">{item.name || `Product ${item.product}`}</p>
                      <p className="text-gray-600">
                        Qty: {item.quantity || 0} | Price: ${Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No purchased items found.</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                disabled={selectedUser.role === "admin"}
              >
                Delete User
              </button>
              {selectedUser.role === "admin" && (
                <p className="self-center text-sm text-gray-500">Admin users cannot be deleted.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteConfirmOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold">Confirm delete</h3>
            <p className="mt-2 text-sm text-gray-600">
              Delete {selectedUser.name || selectedUser.email}? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md border border-red-300 bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={() =>
                  deleteUserMutation.mutate(selectedUser._id, {
                    onSuccess: (data) => {
                      toast.success(data.msg || "User deleted");
                      setDeleteConfirmOpen(false);
                      setSelectedUserId(null);
                      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
                      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
                    },
                    onError: (err) => {
                      toast.error(err.response?.data?.msg || "Could not delete user");
                    },
                  })
                }
                disabled={selectedUser.role === "admin" || deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

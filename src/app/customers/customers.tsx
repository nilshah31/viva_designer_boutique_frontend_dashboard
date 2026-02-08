"use client";

import { useState, useMemo, useEffect } from "react";
import { FaEye, FaPencilAlt, FaPrint, FaTrash } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import CustomerModal from "@/app/components/ui/modals/customer"; // adjust path if needed
import { FaRulerCombined } from "react-icons/fa6";
import CustomerMeasurementModal from "@/app/components/ui/modals/customerMeasurement";
import { CustomerMeasurement } from "../measurements/interfaces/customerMeasurements.interface";
import printCustomerMeasurement from "./printCustomerMeasurement";
import { shareToWhatsApp, shareToWhatsAppBusiness } from "./whatsappShareMeasurement";
import FullScreenLoader from "@/app/components/ui/FullScreenLoader";
import { useAuth } from "@/app/providers/AuthProvider";

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  address: string;
}

const PAGE_SIZE = 20;

export default function Customers() {
  const { canDeleteCustomer, canEditCustomer, canAddCustomer } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [measurementCustomerId, setMeasurementCustomerId] = useState<
    number | null
  >(null);

  const [allMeasurements, setAllMeasurements] = useState<
    Record<number, CustomerMeasurement>
  >({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/customers`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const apiData = await res.json();
          setCustomers(apiData.data);
        } else {
          setCustomers([]);
        }
      } catch (error) {
        console.error("Error loading customers:", error);
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  type ModalMode = "add" | "view" | "edit" | "delete" | null;

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  const filteredCustomers = customers
    ? useMemo(() => {
        return customers.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.mobile.includes(search),
        );
      }, [customers, search])
    : [];

  const totalPages = Math.ceil(filteredCustomers.length / PAGE_SIZE);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCustomers.slice(start, start + PAGE_SIZE);
  }, [filteredCustomers, currentPage]);

  const closeModal = () => {
    setSelectedCustomer(null);
    setModalMode(null);
    setErrors([]);
  };

  const openAddCustomerModal = () => {
    setSelectedCustomer({ id: Date.now(), name: "", mobile: "", address: "" });
    setModalMode("add");
  };

  const handleSave = async () => {
    if (!selectedCustomer) return;

    // Validation
    const { name, mobile, address } = selectedCustomer;
    const newErrors: string[] = [];

    if (!name || name.trim() === "") {
      newErrors.push("Name is required");
    }

    if (!mobile || mobile.length !== 10) {
      newErrors.push("Mobile number must be exactly 10 digits");
    }

    if (!address || address.trim() === "") {
      newErrors.push("Address is required");
    }

    // If there are errors, display them and return
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors([]);

    console.log("selectedCustomer", selectedCustomer);

    setIsLoading(true);
    try {
      if (modalMode === "add") {
        const res = await fetch(`/api/customers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedCustomer),
        });

        if (res.ok) {
          const apiResponse = await res.json();
          const newCustomer = apiResponse.data;
          setCustomers((prev) => [...prev, newCustomer]);
        } else {
          console.error("Failed to add customer");
          setErrors(["Failed to add customer"]);
        }
      }

      if (modalMode === "edit") {
        const res = await fetch(`/api/customers`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedCustomer),
        });

        if (res.ok) {
          const apiResponse = await res.json();
          const updatedCustomer = apiResponse.data;
          console.log("Updated customer response:", updatedCustomer);
          setCustomers((prev) =>
            prev.map((c) => {
              // Match by id - use the updated customer's id
              if (c.id === selectedCustomer.id) {
                return updatedCustomer;
              }
              return c;
            }),
          );
        } else {
          console.error("Failed to update customer");
          setErrors(["Failed to update customer"]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error saving customer:", error);
      setErrors(["Error saving customer"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative px-2 md:px-0">
      <FullScreenLoader show={isLoading} text="Processing..." />
      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">Customers</h2>

        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Search name or mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-lg bg-black border border-gray-700 text-white text-sm outline-none flex-1 min-w-[200px]"
          />

          {canAddCustomer() && (
            <button
              onClick={openAddCustomerModal}
              disabled={isLoading}
              className="bg-gold text-black px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Customer
            </button>
          )}
        </div>
      </div>

      {/* RESPONSIVE SINGLE SOURCE LAYOUT */}
      <div className="space-y-3">
        {/* HEADER — desktop only */}
        <div className="hidden md:grid grid-cols-4 text-sm text-gray-400 border-b border-gray-800 pb-2">
          <div>Customer Name</div>
          <div>Mobile Number</div>
          <div>Address</div>
          <div className="text-center">Actions</div>
        </div>

        {paginatedCustomers.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No customers found</p>
        ) : (
          paginatedCustomers.map((customer, index) => (
            <div
              key={`${customer.id}-${index}`}
              className="
          grid grid-cols-1 gap-3
          md:grid-cols-4 md:items-center
          bg-[#111] border border-gray-800 rounded-xl p-4
        "
            >
              {/* Name */}
              <div className="text-white font-semibold md:font-normal">
                {customer.name}
              </div>

              {/* Mobile */}
              <div className="text-gray-300">{customer.mobile}</div>

              {/* Address */}
              <div className="text-gray-400 text-sm md:text-base">
                {customer.address}
              </div>

              {/* Actions */}
              <div className="flex gap-5 md:justify-center text-gray-400">
                <FaRulerCombined
                  onClick={() => {
                    setMeasurementCustomerId(customer.id);
                    setSelectedCustomer(customer);
                  }}
                  title="Measurement"
                  className="cursor-pointer text-lg md:text-xl hover:text-green-400 transition"
                />

                <FaEye
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setModalMode("view");
                  }}
                  title="View Customer Details"
                  className="cursor-pointer text-lg md:text-xl hover:text-blue-400 transition"
                />

                {/* ✅ PRINT BUTTON */}
                <FaPrint
                  onClick={() => printCustomerMeasurement(customer, allMeasurements[customer.id])}
                  title="Print Measurement"
                  className="cursor-pointer text-lg md:text-xl text-gray-400 hover:text-green-300 transition"
                />

                {/* ✅ WHATSAPP SHARE BUTTON */}
                <FaWhatsapp
                  onClick={() => shareToWhatsApp(customer, allMeasurements[customer.id])}
                  title="Share on WhatsApp"
                  className="cursor-pointer text-lg md:text-xl text-gray-400 hover:text-green-500 transition"
                />

                {/* ✅ WHATSAPP BUSINESS SHARE BUTTON */}
                <FaWhatsapp
                  onClick={() => shareToWhatsAppBusiness(customer, allMeasurements[customer.id])}
                  title="Share on WhatsApp Business"
                  className="cursor-pointer text-lg md:text-xl text-gray-400 hover:text-blue-400 transition"
                  style={{ opacity: 0.7 }}
                />

                <FaPencilAlt
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setModalMode("edit");
                  }}
                  title="Edit"
                  className="cursor-pointer text-lg md:text-xl hover:text-yellow-400 transition"
                />

                {canDeleteCustomer() && (
                  <FaTrash
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setModalMode("delete");
                    }}
                    title="Delete"
                    className="cursor-pointer text-lg md:text-xl hover:text-red-500 transition"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 text-sm flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded border border-gray-700 disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-gold text-black"
                  : "border-gray-700 text-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded border border-gray-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <CustomerModal
        open={modalMode !== null}
        title={
          modalMode === "delete"
            ? "Confirm Delete"
            : modalMode === "view"
              ? "View Customer"
              : modalMode === "add"
                ? "Add Customer"
                : "Edit Customer"
        }
        onClose={() => {
          setModalMode(null);
          setSelectedCustomer(null);
        }}
        footer={
          modalMode === "delete" ? (
            <>
              <button
                onClick={() => setModalMode(null)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (selectedCustomer) {
                    console.log("selectedCustomer for delete - ", selectedCustomer);
                    setIsLoading(true);
                    try {
                      const res = await fetch(`/api/customers`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: selectedCustomer.id }),
                      });

                      if (res.ok) {
                        setCustomers((prev) =>
                          prev.filter((c) => c.id !== selectedCustomer.id),
                        );
                      } else {
                        console.error("Failed to delete customer");
                      }
                    } catch (error) {
                      console.error("Error deleting customer:", error);
                    } finally {
                      setIsLoading(false);
                    }
                  }
                  setModalMode(null);
                  setSelectedCustomer(null);
                }}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </>
          ) : modalMode === "edit" || modalMode === "add" ? (
            <>
              <button
                onClick={() => {
                  setModalMode(null);
                  setSelectedCustomer(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gold text-black text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setModalMode(null);
                setSelectedCustomer(null);
              }}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm"
            >
              Close
            </button>
          )
        }
      >
        {/* MODAL BODY */}
        {selectedCustomer && modalMode === "view" && (
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <b>Name:</b> {selectedCustomer.name}
            </p>
            <p>
              <b>Mobile:</b> {selectedCustomer.mobile}
            </p>
            <p>
              <b>Address:</b> {selectedCustomer.address}
            </p>
          </div>
        )}

        {selectedCustomer && (modalMode === "edit" || modalMode === "add") && (
          <div className="space-y-2 text-sm text-gray-300">
            {errors.length > 0 && (
              <div className="bg-red-900 border border-red-700 rounded p-3 mb-4">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-300">
                    {error}
                  </p>
                ))}
              </div>
            )}
            <p>
              <b>Name:</b>
              <input
                value={selectedCustomer.name}
                onChange={(e) => {
                  setSelectedCustomer({
                    ...selectedCustomer,
                    name: e.target.value,
                  });
                  if (errors.length > 0) setErrors([]);
                }}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm"
              />
            </p>
            <p>
              <b>Mobile:</b>
              <input
                type="tel"
                value={selectedCustomer.mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setSelectedCustomer({
                    ...selectedCustomer,
                    mobile: value,
                  });
                }}
                placeholder="10 digit mobile number"
                maxLength={10}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm"
              />
              {selectedCustomer.mobile &&
                selectedCustomer.mobile.length !== 10 && (
                  <span className="text-red-500 text-xs">
                    Mobile number must be 10 digits
                  </span>
                )}
            </p>
            <p>
              <b>Address:</b>
              <input
                value={selectedCustomer.address}
                onChange={(e) => {
                  setSelectedCustomer({
                    ...selectedCustomer,
                    address: e.target.value,
                  });
                  if (errors.length > 0) setErrors([]);
                }}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm"
              />
            </p>
          </div>
        )}

        {selectedCustomer && modalMode === "delete" && (
          <p className="text-gray-400 text-sm">
            Are you sure you want to delete{" "}
            <span className="text-white font-medium">
              {selectedCustomer.name}
            </span>
            ?
          </p>
        )}
      </CustomerModal>
      <CustomerMeasurementModal
        open={measurementCustomerId !== null}
        customerId={measurementCustomerId!}
        initialData={
          measurementCustomerId
            ? allMeasurements[measurementCustomerId]
            : undefined
        }
        customerName={selectedCustomer?.name}
        onClose={() => setMeasurementCustomerId(null)}
        onSave={(data) =>
          setAllMeasurements((prev) => ({
            ...prev,
            [data.customerId]: data,
          }))
        }
        isViewMode={false}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import Modal from "@/app/components/ui/modals/customer";

interface Customer {
  id: number;
  name: string;
  mobile: string;
  address: string;
}

const dummyCustomers: Customer[] = [
  {
    id: 1,
    name: "Riya Patel",
    mobile: "9876543210",
    address: "Maninagar, Ahmedabad",
  },
  {
    id: 2,
    name: "Neha Shah",
    mobile: "9825012345",
    address: "Navrangpura, Ahmedabad",
  },
];

type Mode = "add" | "view" | "edit" | null;

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openAdd = () => {
    setActiveCustomer({ id: Date.now(), name: "", mobile: "", address: "" });
    setMode("add");
  };

  const openModal = (customer: Customer, mode: Mode) => {
    setActiveCustomer({ ...customer });
    setMode(mode);
  };

  const closeModal = () => {
    setActiveCustomer(null);
    setMode(null);
  };

  const handleSave = () => {
    if (!activeCustomer) return;

    if (mode === "add") {
      setCustomers((prev) => [...prev, activeCustomer]);
    }

    if (mode === "edit") {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === activeCustomer.id ? activeCustomer : c
        )
      );
    }

    closeModal();
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Customers</h2>

        <button
          onClick={openAdd}
          className="bg-gold text-black px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110"
        >
          + Add Customer
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border border-gray-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#111] text-gray-300">
            <tr>
              <th className="text-left p-3">Customer Name</th>
              <th className="text-left p-3">Mobile Number</th>
              <th className="text-left p-3">Address</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-gray-800">
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.mobile}</td>
                <td className="p-3">{customer.address}</td>

                <td className="p-3 text-center">
                  <div className="flex justify-center gap-4 text-gray-400">
                    <FaEye
                      onClick={() => openModal(customer, "view")}
                      className="cursor-pointer hover:text-blue-400"
                    />
                    <FaPencilAlt
                      onClick={() => openModal(customer, "edit")}
                      className="cursor-pointer hover:text-yellow-400"
                    />
                    <FaTrash
                      onClick={() => setDeleteId(customer.id)}
                      className="cursor-pointer hover:text-red-500"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ ADD / VIEW / EDIT MODAL */}
      <Modal
        open={!!activeCustomer && !!mode}
        title={
          mode === "add"
            ? "Add Customer"
            : mode === "edit"
            ? "Edit Customer"
            : "Customer Details"
        }
        onClose={closeModal}
        footer={
          <>
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm"
            >
              Close
            </button>

            {mode !== "view" && (
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-gold text-black text-sm font-semibold"
              >
                {mode === "add" ? "Add" : "Save"}
              </button>
            )}
          </>
        }
      >
        {activeCustomer && (
          <div className="space-y-4 text-sm">
            <input
              disabled={mode === "view"}
              placeholder="Name"
              value={activeCustomer.name}
              onChange={(e) =>
                setActiveCustomer({
                  ...activeCustomer,
                  name: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-black border border-gray-700"
            />

            <input
              disabled={mode === "view"}
              placeholder="Mobile"
              value={activeCustomer.mobile}
              onChange={(e) =>
                setActiveCustomer({
                  ...activeCustomer,
                  mobile: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-black border border-gray-700"
            />

            <textarea
              disabled={mode === "view"}
              placeholder="Address"
              value={activeCustomer.address}
              onChange={(e) =>
                setActiveCustomer({
                  ...activeCustomer,
                  address: e.target.value,
                })
              }
              className="w-full p-2 rounded bg-black border border-gray-700"
            />
          </div>
        )}
      </Modal>

      {/* ✅ DELETE MODAL */}
      <Modal
        open={!!deleteId}
        title="Confirm Delete"
        onClose={() => setDeleteId(null)}
        width="sm"
        footer={
          <>
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-gray-400 text-sm">
          Are you sure you want to delete this customer? This action cannot be undone.
        </p>
      </Modal>

    </div>
  );
}

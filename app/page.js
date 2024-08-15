"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchData } from "@/utils/dbFuncs";
import Loading from "@/components/Loading/Loading";
import { useLoading } from "@/context/LoadingContext";
import TotalAmountCard from "@/components/Others/TotalAmountCard";

const Home = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading();
  const [unpaidLoans, setUnpaidLoans] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUnpaidLoans = async () => {
      startLoading();
      try {
        const api = "/api/loan/getunpaidloans";
        const loans = await fetchData(api);
        setUnpaidLoans(loans.loans);
      } catch (error) {
        console.error("Error fetching unpaid loans:", error);
      } finally {
        stopLoading();
      }
    };

    fetchUnpaidLoans();
  }, []);

  console.log(unpaidLoans);

  return (
    <main className="overflow-hidden" style={{ marginLeft: marginForSidebar }}>
      {loading && <Loading />}
      <TotalAmountCard />
      <section className="py-8 px-8">
        <div className="top flex items-center justify-between">
          <div className="left">
            <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
              Unpaid Loans
            </h2>
            <p className="text-sm text-gray-600 py-1 tracking-wide">
              Loans whose installment is not paid yet
            </p>
          </div>
        </div>
        <div className="px-4 py-8">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="table-heading">
                    Sr No.
                  </th>
                  <th scope="col" className="table-heading">
                    Image
                  </th>
                  <th scope="col" className="table-heading">
                    Client Name
                  </th>
                  <th scope="col" className="table-heading">
                    Loan Number
                  </th>
                  <th scope="col" className="table-heading">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {unpaidLoans.length > 0 ? (
                  unpaidLoans.map(
                    (
                      {
                        _id,
                        loanNo,
                        amount,
                        client,
                        paid, // Ensure the paid field is available
                      },
                      index
                    ) => (
                      <tr
                        className="bg-white border-b hover:bg-gray-50"
                        key={_id}
                      >
                        <td className="table-data text-gray-900 font-semibold">
                          <div className="flex items-center space-x-2">
                            <span>{index + 1}.)</span>
                            {!paid && (
                              <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-red-600 bg-red-200">
                                Unpaid
                              </span>
                            )}
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="flex items-center table-data text-gray-900 whitespace-nowrap"
                        >
                          {client && (
                            <Image
                              alt="Client Image"
                              className="w-16 h-16"
                              layout="fixed"
                              width={58}
                              height={58}
                              objectFit="cover"
                              src={client.image.url}
                            />
                          )}
                        </th>
                        <td className="table-data">
                          {client ? client.name : "N/A"}
                        </td>
                        <td className="table-data">{loanNo}</td>
                        <td className="table-data">{`₹ ${amount}`}</td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No unpaid loans available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

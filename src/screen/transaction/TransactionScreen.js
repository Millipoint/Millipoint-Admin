import { TransactionItem } from "../../components/TransactionItem";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/CurrencyUtils";

import _ from 'lodash';
import { encrypt } from "../../utils/Crypto";

export default function TransactionScreen() {
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(params.get("page") || "1");
    const search = params.get("search") || ""
    const [totalPage, setTotalPage] = useState(0)
    const [data, setData] = useState({ data: [], pagination: { total_page: 5 } })
    const [filterStatus, setFilterStatus] = useState("");  // Status yang dipilih

    const [statusLabel, setStatusLabel] = useState("Filter status");  // Variabel untuk menyimpan hasil mapping status

    const handleSearchInput = _.debounce((s) => {
        fetchData(s)
        setParams(prev => {
            const newParams = new URLSearchParams(prev)
            newParams.set("search", s)
            return newParams
        })
    }, 500)

    function fetchData(query) {
        toast.loading("Sedang memuat data transaksi")

        axios.get(`https://api.millipoint.id/api/v1/get-all-transactions?page=${page}&status=${filterStatus}&search=${query}`)
            .then((res) => {
                toast.dismiss()
                setData(res.data)
            })
            .catch((e) => {
                toast.dismiss()
                toast.error(e)
            })
    }

    useEffect(() => {
        switch (filterStatus) {
            case "0":
                setStatusLabel("Menunggu")
                break;
            case "1":
                setStatusLabel("Proses")
                break;
            case "2":
                setStatusLabel("Sukses")
                break;
            case "3":
                setStatusLabel("Gagal")
                break;
            default:
                setStatusLabel("Filter status")
                break;
        }
    }, [filterStatus])

    useEffect(() => {
        setParams(prev => {
            const newParams = new URLSearchParams(prev)
            newParams.set("status", filterStatus)
            newParams.set("page", page)
            return newParams
        })
        fetchData(search)
    }, [filterStatus, page])

    async function handleProcessTransaction(apiKey, transaction_id) {
        toast.loading("Sedang memproses data")
        axios.post('https://api.millipoint.id/api/v1/process-transaction', {
            api_key: encrypt(apiKey, process.env.ENCRYPTION_KEY),
            transaction: encrypt(transaction_id, process.env.ENCRYPTION_KEY)
        }).then((res) => {
            toast.dismiss()
            fetchData(search)
        }).catch((e) => {
            toast.dismiss()
            toast.error(e)
        })
    }

    useEffect(() => {
        setTotalPage(data.pagination.total_page)
    }, data)

    return <div class="bg-black">
        <div class="px-5 py-4">
            <h3 class="text-white">Halaman Admin Millipoint</h3>
            <div class="text-end">
                <div class="mb-3">
                    <input
                        type="text"
                        class="form-control"
                        onChange={(e) => {
                            handleSearchInput(e.target.value)
                        }}
                        aria-describedby="helpId"
                        placeholder="Cari berdasarkan nomor tiket / id transaksi"
                    />
                </div>

                <div class="dropdown mb-3">
                    <button class="btn btn-info dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {statusLabel}
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" onClick={() => { setFilterStatus("") }}>Semua</a></li>
                        <li><a class="dropdown-item" onClick={() => { setFilterStatus("0") }}>Menunggu</a></li>
                        <li><a class="dropdown-item" onClick={() => { setFilterStatus("1") }}>Proses</a></li>
                        <li><a class="dropdown-item" onClick={() => { setFilterStatus("2") }}>Berhasil</a></li>
                        <li><a class="dropdown-item" onClick={() => { setFilterStatus("3") }}>Gagal</a></li>
                        <li><a class="dropdown-item" onClick={() => { setFilterStatus("4") }}>Sedang dikirim</a></li>
                    </ul>
                </div>
            </div>
            <div class="card-body">
                <div>{data.data.map(item => {
                    return <div class="mb-3">
                        <TransactionItem
                            transactionId={item.id}
                            ticketNumber={item.ticket_number}
                            tanggal={item.created_at}
                            status={item.status}
                            namaProduk={item.product_name}
                            whatsapp={item.whatsapp}
                            harga={formatCurrency(item.final_price)}
                            onProcessClick={(apiKey) => {
                                handleProcessTransaction(apiKey, item.id)
                            }}
                        />
                    </div>
                })}</div>
                <div class="row">
                    <button
                        type="button"
                        class="btn btn-primary col-3 mx-2"
                        onClick={() => {
                            if (page - 1 > 0) {
                                setPage(parseInt(page) - 1)
                            }
                        }}
                    >
                        Prev
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary col-3 mx-2"
                        onClick={() => {
                            setPage(parseInt(page) + 1)
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
}
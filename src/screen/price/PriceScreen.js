import axios from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";

import _ from 'lodash';
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/CurrencyUtils";
import { decrypt, encrypt } from "../../utils/Crypto";

export default function PriceScreen() {
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(params.get("page") || "1");
    const search = params.get("search") || ""
    const [totalPage, setTotalPage] = useState(0)
    const [data, setData] = useState({ data: [], pagination: { total_page: 5 } })

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

        axios.get(`https://api.millipoint.id/api/v1/admin/products?page=${page}&search=${query}`)
            .then((res) => {
                toast.dismiss()

                const body = JSON.parse(decrypt(res.data, process.env.REACT_APP_ENCRYPTION_KEY))

                setData(body)
            })
            .catch((e) => {
                toast.dismiss()
                toast.error(e)
            })
    }

    useEffect(() => {
        setParams(prev => {
            const newParams = new URLSearchParams(prev)
            newParams.set("page", page)
            return newParams
        })
        fetchData(search)
    }, [page])

    return <div class="bg-black">
        <div class="px-5 py-4">
            <h3 class="text-white">Halaman Admin Harga Produk</h3>
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
            </div>
            <div
                class="table-responsive"
            >
                <table
                    class="table table-striped table-hover table-borderless table-primary align-middle"
                >
                    <thead class="table-primary">
                        <tr>
                            <th style={{ width: "40%" }}>Nama produk</th>
                            <th>Harga asli</th>
                            <th>Harga jual</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {(() => {
                            return data.data.map((item, index) => {
                                return <tr class="table-light">
                                    <td scope="row">{item.label}</td>
                                    <td>{formatCurrency(item.old_price)}</td>
                                    <td>{(() => {
                                        return <div class="input-group">
                                            <span class="input-group-text">Rp</span>                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="Masukkan harga"
                                                defaultValue={item.active_price}
                                            />
                                        </div>
                                    })()}</td>
                                    <td>{(() => {
                                        return <button
                                            type="button"
                                            class="btn btn-primary"
                                            style={{
                                                width: "100%"
                                            }}
                                            onClick={() => {
                                                if (page - 1 > 0) {
                                                    setPage(parseInt(page) - 1)
                                                }
                                            }}
                                        >
                                            Simpan
                                        </button>
                                    })()}</td>
                                </tr>
                            })
                        })()}
                    </tbody>
                    <tfoot>

                    </tfoot>
                </table>
            </div>

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
}
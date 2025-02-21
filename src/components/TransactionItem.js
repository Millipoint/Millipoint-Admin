import { useState } from "react";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";

export const TransactionItem = ({
    transactionId,
    ticketNumber,
    tanggal,
    status,
    namaProduk,
    whatsapp,
    harga,
    onProcessClick
}) => {
    let badgeClass;
    let badgeText;
    const [apiKey, setApiKey] = useState("");

    const handleInputChange = (e) => {
        setApiKey(e.target.value);
    };

    switch (status) {
        case '0':
            badgeClass = 'bg-warning';
            badgeText = 'Menunggu';
            break;
        case '1':
            badgeClass = 'bg-info';
            badgeText = 'Proses';
            break;
        case '2':
            badgeClass = 'bg-success';
            badgeText = 'Sukses';
            break;
        case '3':
            badgeClass = 'bg-danger';
            badgeText = 'Gagal';
            break;
        case '4':
            badgeClass = 'bg-primary';
            badgeText = 'Sedang dikirim';
            break;
        default:
            badgeClass = 'bg-secondary';
            badgeText = 'Status Tidak Dikenal';
    }

    return <div class="accordion">
        <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingOne">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-${ticketNumber}`} aria-expanded="false" aria-controls={`flush-${ticketNumber}`}>
                    <div
                        class="row align-items-center g-2 w-100"
                    >
                        <div className="col-10">
                            <h5 className="fs-8">Nomor Tiket: {ticketNumber}</h5>
                            <h6 className="fs-9"><strong>Tanggal Transaksi: {tanggal}</strong></h6>
                        </div>
                        <div className="col-2">
                            <h6 className="fs-8">{harga}</h6>
                            <span className={`badge ${badgeClass} fs-9`}>{badgeText}</span>
                        </div>
                    </div>

                </button>
            </h2>
            <div id={`flush-${ticketNumber}`} class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                    <div class="row align-items-center g-2 w-100"                    >
                        <div class="col-10">
                            <h6>Nama Produk: {namaProduk}</h6>
                            <h6>Whatsapp: <a href={`https://wa.me/${whatsapp}`} target="_blank">{whatsapp}</a></h6>
                            <h6>ID Transaksi: {transactionId}</h6>
                            <h6><strong>Tanggal Transaksi: {tanggal}</strong></h6>
                        </div>
                        <div class="col-2">
                            {(() => {
                                switch (status) {
                                    case '0':
                                        return <Popup
                                            trigger={<button type="button" class="btn btn-warning" onClick={onProcessClick}>Proses Pesanan</button>}
                                            modal
                                        >
                                            <div class="m-3">
                                                <div>
                                                    <label for="" class="form-label">Masukkan API KEY</label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        value={apiKey}  // Mengikat nilai input ke state
                                                        onChange={handleInputChange}
                                                        aria-describedby="helpId"
                                                        placeholder=""
                                                    />
                                                    <small id="helpId" class="form-text text-muted">API Key adalah kunci unik yang hanya dimiliki oleh admin</small>
                                                </div>
                                                <button
                                                    type="button"
                                                    class="btn btn-primary mt-3"
                                                    onClick={() => {
                                                        if (apiKey.length == 0) {
                                                            toast.error("API KEY tidak boleh kosong")
                                                        } else {
                                                            onProcessClick(apiKey)
                                                        }
                                                    }}
                                                >
                                                    Proses
                                                </button>
                                            </div>

                                        </Popup>
                                    default:
                                        return <div />
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
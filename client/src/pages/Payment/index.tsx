function Payment() {
    return (
        <>
            <div className="flex items-center justify-center bg-gray-200 px-4 py-8">
                <div className="mx-auto w-full max-w-md rounded bg-white p-6 shadow pb-3">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold">Demo thanh toán VNPay</h1>
                    </div>
                    <form className="grid gap-4" action="/" method="post">
                        <div className="mb-4">
                            <label htmlFor="amountInput" className="block text-sm font-medium text-gray-700">Số tiền <span className="text-red-600">*</span></label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                id="amountInput"
                                name="amountInput"
                                placeholder="10000"
                                defaultValue="10000"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contentPayment" className="block text-sm font-medium text-gray-700">Nội dung thanh toán <span className="text-red-600">*</span></label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                id="contentPayment"
                                name="contentPayment"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="productTypeSelect" className="block text-sm font-medium text-gray-700">Loại Hàng Hóa</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    id="productTypeSelect"
                                    name="productTypeSelect"
                                    defaultValue="other"
                                >
                                    <option value="other">Khác</option>
                                    {/* Other options */}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="bankSelect" className="block text-sm font-medium text-gray-700">Ngân hàng</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    id="bankSelect"
                                    name="bankSelect"
                                    defaultValue=""
                                >
                                    <option value="">Không chọn</option>
                                    {/* Other options */}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="langSelect" className="block text-sm font-medium text-gray-700">Ngôn ngữ</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    id="langSelect"
                                    name="langSelect"
                                    defaultValue="vi"
                                >
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div>
                                <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent bg-indigo-600 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" id="createUrlBtn">Tạo URL</button>
                            </div>
                            <div>
                                <button type="submit" className="inline-flex justify-center w-full rounded-md border border-transparent bg-gray-600 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Thanh toán redirect</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Payment;

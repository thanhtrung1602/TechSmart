import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import useGet from "~/hooks/useGet";
import Address from "~/models/Address";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import {
  setAddAddressData,
  setAddressId,
  setDeliveryType,
  setHiddenForm,
  setSelectIdAddress,
} from "~/redux/addressSlice";
import { memo, useEffect, useState } from "react";
import AddAddress from "./addAddress";
import DeliveryStore from "./deliveryStore";
function DeleveryInfor() {
  const userProfile = useSelector(
    (state: RootState) => state.userProfile.userProfile
  );
  const { hiddenForm, selectIdAddress, deliveryType } = useSelector(
    (state: RootState) => state.address
  );

  const { data: address } = useGet<Address[]>(
    `address/getAddressesByUser/${userProfile?.id}`
  );
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (deliveryType && selectIdAddress === 0) {
      setErrorMessage("Vui lòng chọn địa chỉ của hàng bạn mong muốn !!");
    } else {
      setErrorMessage("");
    }
  }, [deliveryType, selectIdAddress]);
  return (
    <div className="py-8">
      <div className="w-full">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-base font-bold mb-4">Thông tin nhận hàng</h1>
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div
              className={`relative flex items-center cursor-pointer ${
                deliveryType ? "bg-white" : "bg-gray-100"
              } p-3 rounded`}
              onClick={() => dispatch(setDeliveryType(true))}
            >
              <input
                type="radio"
                value="store"
                className="absolute opacity-0 bg-white"
              />
              <div className="w-4 h-4 rounded-full border border-gray-300 mr-2 flex items-center justify-center">
                {deliveryType && (
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-sm">Nhận tại cửa hàng</span>
            </div>
            <div
              className={`relative flex items-center cursor-pointer ${
                !deliveryType ? "bg-white" : "bg-gray-100"
              } p-3 rounded`}
              onClick={() => dispatch(setDeliveryType(false))}
            >
              <input
                type="radio"
                checked={!deliveryType}
                onChange={() => dispatch(setDeliveryType(false))}
                className="absolute opacity-0 bg-white"
              />
              <div className="w-4 h-4 rounded-full border border-gray-300 mr-2 flex items-center justify-center">
                {!deliveryType && (
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-sm">Giao hàng tận nơi</span>
            </div>
          </div>

          {deliveryType && <DeliveryStore />}
          <div className="block text-xs text-gray-500 mb-1">
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
          </div>

          {!deliveryType && (
            <div>
              {userProfile && address && address?.length > 0 ? (
                <>
                  {!hiddenForm && (
                    <div className="space-y-3">
                      {address?.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded border border-transparent hover:border-gray-200"
                          onClick={() =>
                            dispatch(setSelectIdAddress(address.id))
                          }
                        >
                          <div>
                            <div className="flex gap-2 mb-1">
                              <span className="text-sm font-medium">
                                {address.name}
                              </span>
                              <span className="text-sm text-gray-600">
                                {address.phone}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.street}, {address.ward},{" "}
                              {address.district.name}, {address.province.name}
                            </p>
                          </div>
                          {selectIdAddress === address.id && (
                            <IoIosCheckmarkCircleOutline className="text-green-600 text-xl" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {!selectIdAddress && !hiddenForm && (
                    <p className="text-sm text-red-500 mt-2">
                      Vui lòng chọn địa chỉ giao hàng
                    </p>
                  )}
                  {!hiddenForm && (
                    <button
                      onClick={() => {
                        dispatch(setHiddenForm());
                        dispatch(setSelectIdAddress(0));
                        dispatch(setAddAddressData(true));
                      }}
                      className="mt-4 px-5 py-2.5 text-white text-sm rounded-md bg-red-500 hover:bg-red-600 transition-colors duration-300 "
                    >
                      Thêm địa chỉ mới
                    </button>
                  )}

                  {hiddenForm && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-6 relative">
                      <button
                        onClick={() => {
                          dispatch(setHiddenForm());
                          dispatch(setAddAddressData(false));
                          dispatch(setAddressId(0));
                        }}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                      ></button>
                      <AddAddress />
                    </div>
                  )}
                </>
              ) : (
                <AddAddress />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(DeleveryInfor);

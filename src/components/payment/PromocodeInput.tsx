import { FC } from "react";
import { CustomInput } from "../../ui/CustomInput.tsx";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
import { CustomButton } from "../../ui/CustomButton.tsx";
import { toast } from "react-hot-toast";
import { usePaymentStore } from "@/store/usePaymentStore.ts";

import { ChangeEvent } from "react";
import {useTranslation} from "react-i18next";

interface Props {
    promoCodeField: {
        value?: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    };
}

export const PromocodeInput: FC<Props> = ({ promoCodeField }) => {
    const { verifyPromo, order } = usePaymentStore();
    const {t} = useTranslation();

    const onClick = async () => {
        if (!promoCodeField.value) {
            return toast.error(t("paymentPage.promocode.toasts.empty"));
        }

        if (!order.event_id) {
            return toast.error("Выберите событие");
        }

        const errorMessage = await verifyPromo({
            code: promoCodeField.value,
            event_id: order.event_id,
        });

        if (errorMessage) {
            toast.error(t("paymentPage.promocode.toasts.invalid"));
        } else {
            toast.success(t("paymentPage.promocode.toasts.success"));
        }
    };

    return (
        <div className="flex gap-[20px] mt-[20px] mb-[20px]">
            <CustomInput
                icon={<ReceiptPercentIcon className="text-[#6B9AB0]" />}
                type="text"
                placeholder={t('paymentPage.promocode.promoPH')}
                value={promoCodeField.value || ""}
                onChange={(e) => promoCodeField.onChange(e)}
            />
            <CustomButton onClick={onClick} variant="default" className="text-[16px]">
                {t('paymentPage.promocode.check')}
            </CustomButton>
        </div>
    );
};

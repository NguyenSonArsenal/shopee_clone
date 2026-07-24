"use client"

import MyModal from "@modal/MyModal";
import {useState} from "react";
import TermOfUseContent from "@feature/auth/page/register/TermOfUseContent";
import TermOfPolicyContent from "@feature/auth/page/register/TermOfPolicyContent";

type LegalAgreementProps = {
  checked: boolean                        // agree hiện tại, cha truyền xuống
  setAgree: (checked: boolean) => void    // báo ngược lên cha khi user tick
}

// memo: prevent re-render
const LegalAgreement = ({ checked, setAgree }: LegalAgreementProps) => {
  const [openTermModal, setOpenTermModal] = useState<boolean>(false)
  const [openPolicyModal, setOpenPolicyModal] = useState<boolean>(false)

  return (
    <>
      {/* Điều khoản */}
      <div className="terms" style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0", fontSize: 13 }}>
        <input
          id="agree"
          type="checkbox"
          className="agree-checkbox"
          checked={checked}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <label htmlFor="agree" className="text-(--muted) cursor-pointer">
          Tôi đồng ý với{" "}
          <button type="button" onClick={() => setOpenTermModal(true)} className="text-(--primary) cursor-pointer">
            Điều khoản dịch vụ
          </button>
          {" "}
          và{" "}
          <button type="button" onClick={() => setOpenPolicyModal(true)} className="text-(--primary) cursor-pointer">
            Chính sách bảo mật
          </button>
        </label>
      </div>

      <MyModal open={openTermModal} title={"Điều khoản & Điều kiện"} onClose={() => setOpenTermModal(false)}>
        <TermOfUseContent />
      </MyModal>

      <MyModal open={openPolicyModal} title={"Chính sách bảo mật"} onClose={() => setOpenPolicyModal(false)}>
        <TermOfPolicyContent />
      </MyModal>
    </>
  );
}

export default LegalAgreement;


import { Form } from 'antd';
import { useState } from 'react';
import { message } from '@/utils/notice';

export const enum ModalType {
  CREATE,
  UPDATE,
  OTHER,
}

export const ModalTypeCname = {
  [ModalType.CREATE]: '创建',
  [ModalType.UPDATE]: '修改',
  [ModalType.OTHER]: '操作',
};

class FormModal {
  open = false;
  type: ModalType = ModalType.CREATE;
  submitLoading?: boolean;
}

interface Options<FormValue> {
  submit?: (values: FormValue, modal: FormModal) => Promise<any>;
}

export function useFormModal<FormValue>(options?: Options<FormValue>) {
  const [formModal, setFormModal] = useState(new FormModal());
  const [form] = Form.useForm<FormValue>();
  const [loading, setLoading] = useState(false);

  const formModalShow = (type: ModalType = ModalType.CREATE) => {
    setFormModal((state) => ({
      ...state,
      open: true,
      type,
    }));
  };
  const formModalClose = () => {
    setFormModal((state) => ({
      ...state,
      open: false,
    }));
  };
  const submitHandler = async () => {
    setLoading(true);
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setFormModal((state) => ({ ...state, submitLoading: true }));
      await options?.submit?.(values, formModal);
      message.success(`${ModalTypeCname[formModal.type!]}成功`);
      setFormModal((state) => ({ ...state, submitLoading: false }));
      if (formModal.type === ModalType.CREATE) {
        form.resetFields();
      }
    } catch (e) {
      setFormModal((state) => ({ ...state, submitLoading: false }));
    }
    setLoading(false);
  };
  return {
    submitLoading: loading,
    form,
    formModal,
    formModalTitle: ModalTypeCname[formModal.type],
    setFormModal,
    formModalShow,
    formModalClose,
    submitHandler,
  };
}
